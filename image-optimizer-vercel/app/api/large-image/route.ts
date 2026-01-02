const DEFAULT_SIZE_BYTES = 20 * 1024 * 1024
const CHUNK_SIZE_BYTES = 1024 * 1024

type LargeImageState = {
  __lastLargeImageBytes?: number
}

const state = globalThis as LargeImageState

function setLastBytes(bytes: number) {
  state.__lastLargeImageBytes = bytes
}

function getLastBytes() {
  return state.__lastLargeImageBytes ?? 0
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('status') === '1') {
    if (searchParams.get('reset') === '1') {
      setLastBytes(0)
    }
    return Response.json({ lastSentBytes: getLastBytes() })
  }

  const mode = searchParams.get('mode') || 'finite'
  const chunkSize = Math.max(
    1,
    Number.parseInt(searchParams.get('chunk') || '', 10) || CHUNK_SIZE_BYTES
  )
  const size = Math.max(
    0,
    Number.parseInt(searchParams.get('size') || '', 10) || DEFAULT_SIZE_BYTES
  )

  setLastBytes(0)

  const chunk = new Uint8Array(Math.min(chunkSize, size || chunkSize)).fill(
    0x41
  )
  let sent = 0

  if (mode === 'loop') {
    const delayMs = Math.max(
      1,
      Number.parseInt(searchParams.get('delay') || '', 10) || 50
    )
    let timer: NodeJS.Timeout | null = null

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        timer = setInterval(() => {
          controller.enqueue(chunk)
          sent += chunk.length
          setLastBytes(sent)
        }, delayMs)
      },
      cancel() {
        if (timer) {
          clearInterval(timer)
          timer = null
        }
      },
    })

    return new Response(stream, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'no-store',
      },
    })
  }

  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (sent >= size) {
        controller.close()
        return
      }
      const remaining = size - sent
      const nextChunk = chunk.subarray(0, Math.min(chunk.length, remaining))
      controller.enqueue(nextChunk)
      sent += nextChunk.length
      setLastBytes(sent)
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'no-store',
    },
  })
}
