export const mockDates = [
  { date: "2025-11-08", is_weekend: false, is_holiday: false },
  { date: "2025-11-09", is_weekend: true, is_holiday: false },
  { date: "2025-11-10", is_weekend: false, is_holiday: false },
  { date: "2025-11-11", is_weekend: false, is_holiday: false },
  { date: "2025-11-12", is_weekend: false, is_holiday: false },
  { date: "2025-11-13", is_weekend: false, is_holiday: false },
  { date: "2025-11-14", is_weekend: false, is_holiday: false },
  { date: "2025-11-15", is_weekend: true, is_holiday: false },
]

export const mockCourts = [
  { id: 1, name: "Court A", description: "Premium court with LED lights", price_per_hour: 150000 },
  { id: 2, name: "Court B", description: "Standard indoor court", price_per_hour: 100000 },
  { id: 3, name: "Court C", description: "Standard indoor court", price_per_hour: 100000 },
]

export const mockTimeslots = [
  { id: 1, start_time: "09:00", end_time: "10:00", is_active: true },
  { id: 2, start_time: "10:00", end_time: "11:00", is_active: true },
  { id: 3, start_time: "11:00", end_time: "12:00", is_active: true },
  { id: 4, start_time: "12:00", end_time: "13:00", is_active: true },
  { id: 5, start_time: "13:00", end_time: "14:00", is_active: true },
  { id: 6, start_time: "14:00", end_time: "15:00", is_active: true },
  { id: 7, start_time: "15:00", end_time: "16:00", is_active: true },
  { id: 8, start_time: "16:00", end_time: "17:00", is_active: true },
]

export const mockReservation = {
  id: "RES-2025-001",
  court_id: 1,
  court_name: "Court A",
  timeslot_id: 1,
  booking_date: "2025-11-10",
  start_time: "09:00",
  end_time: "10:00",
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "08123456789",
  notes: "Double match",
  total_price: 150000,
  status: "pending",
  created_at: "2025-11-07T10:00:00Z",
}
