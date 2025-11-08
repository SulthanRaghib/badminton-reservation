// Normalize configured base and a local fallback for developer convenience.
const configuredBase = (process.env.NEXT_PUBLIC_API_URL || "").trim()
const normalize = (u: string) => (u ? u.replace(/\/+$/g, "") : "")
const API_BASE_URL = normalize(configuredBase) || "http://localhost:8088"
const LOCAL_FALLBACK = "http://localhost:8088" 

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const attemptFetch = async (base: string) => {
    const url = `${base}${endpoint}`
    // Debug logging (only in non-production): indicate which url we try
    if (process.env.NODE_ENV !== "production") {
      try {
        // console.debug in browser will show in DevTools; on server it prints to terminal
        console.debug(`[api] Attempting request -> ${url}`)
      } catch (e) {
        // ignore logging errors
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[api] HTTP ${response.status} from ${url}`)
      }
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
      }
    }

    // Parse JSON body and unwrap common wrapper { success, message, data }
    const body = await response.json().catch(() => null)
    const payload = (body && typeof body === "object" && Object.prototype.hasOwnProperty.call(body, "data"))
      ? (body as any).data
      : body

    if (process.env.NODE_ENV !== "production") {
      console.debug(`[api] Success ${url}`)
    }
    return { success: true, data: payload as T }
  }

  try {
    // First try configured/base URL
    const primary = API_BASE_URL
    if (process.env.NODE_ENV !== "production") console.debug(`[api] primary base = ${primary}`)
    const primaryResult = await attemptFetch(primary)

    // If primary returned successfully or returned an HTTP error, return it.
    if (primaryResult.success) return primaryResult
    if (primaryResult.error) {
      // If it's an HTTP-level error (4xx/5xx), we return it so callers see API message.
      // If it's a transport error it will throw and be caught below; but some transports return an error string.
      if (process.env.NODE_ENV !== "production") console.debug(`[api] primary returned error: ${primaryResult.error}`)
      // If primary and fallback are same, just return primaryResult
      if (normalize(primary) === normalize(LOCAL_FALLBACK)) return primaryResult
      // Try fallback when primary gave an error (network failures are caught below too)
      try {
        if (process.env.NODE_ENV !== "production") console.debug(`[api] trying local fallback = ${LOCAL_FALLBACK}`)
        const fallbackResult = await attemptFetch(LOCAL_FALLBACK)
        if (fallbackResult.success) return fallbackResult
        // If fallback also returns HTTP error, return that
        if (fallbackResult.error) return fallbackResult
      } catch (err2) {
        if (process.env.NODE_ENV !== "production") console.warn(`[api] fallback error: ${err2 instanceof Error ? err2.message : String(err2)}`)
      }
      return primaryResult
    }
    return primaryResult
  } catch (err) {
    // Network/transport error when calling primary. Try local fallback if different.
    if (process.env.NODE_ENV !== "production") console.warn(`[api] primary transport error: ${err instanceof Error ? err.message : String(err)}`)
    try {
      if (normalize(API_BASE_URL) !== normalize(LOCAL_FALLBACK)) {
        if (process.env.NODE_ENV !== "production") console.debug(`[api] attempting fallback ${LOCAL_FALLBACK}`)
        const fallbackResult = await attemptFetch(LOCAL_FALLBACK)
        return fallbackResult
      }
    } catch (err2) {
      if (process.env.NODE_ENV !== "production") console.warn(`[api] fallback transport error: ${err2 instanceof Error ? err2.message : String(err2)}`)
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}

export async function getAvailableDates() {
  return apiCall<any[]>("/api/v1/dates")
}

export async function getAllCourts() {
  return apiCall<any[]>("/api/v1/courts/all")
}

export async function getTimeslots(bookingDate: string, courtId: string) {
  return apiCall<any[]>(`/api/v1/timeslots?booking_date=${bookingDate}&court_id=${courtId}`)
}

export async function createReservation(data: {
  court_id: number
  timeslot_id: number
  booking_date: string
  customer_name: string
  customer_email: string
  customer_phone: string
  notes?: string
}) {
  return apiCall("/api/v1/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getReservation(id: string) {
  return apiCall(`/api/v1/reservations/${id}`)
}

export async function findReservationByEmail(email: string) {
  return apiCall(`/api/v1/reservations/customer?email=${email}`)
}

export async function processPayment(reservationId: string) {
  return apiCall("/api/v1/payments/process", {
    method: "POST",
    body: JSON.stringify({ reservation_id: reservationId }),
  })
}

export async function checkApiHealth() {
  return apiCall("/health")
}
