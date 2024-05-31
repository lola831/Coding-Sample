### Technical Analysis and Implementation Overview

**Title:** Custom Booking and Calendar System for Cod Mountain Fish Co.

**Objective:**
To create a bespoke booking system tailored to the unique requirements of Cod Mountain Fish Co., which could not be adequately met by existing third-party solutions like FareHarbor.

**Key Requirements:**
1. **Seasonal Availability:** Specific trips are offered only during certain times of the year.
2. **Time-Specific Trips:** Some trips are available exclusively in the morning (AM) or afternoon (PM).
3. **Booking Types:** Differentiation between full-boat bookings and individual seat bookings.
4. **Dynamic Trip Offerings:** Afternoon charters' availability is contingent on the type of trip booked in the morning.

**Implementation Details:**

**1. Calendar Component:**
   - **Technology Used:** React, JavaScript
   - **Functionality:**
     - Displays current bookings, blocked days, and cancellations due to weather.
     - Integrates a responsive sidebar that appears as a modal on smaller screens.
     - Updates dynamically to show available trips, times, and seats when a date is clicked.

**Code Snippet:**
```javascript
const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedDateBlocked(isBlockDay(date));
    setSelectedDateFishingSeason(isInFishSeason(date));
    setSelectedDateSalmonSeason(isInSalmonSeason(date));
    setSelectedDateBookings(getBookingsByDay(date));
    setSelectedDateWeather(isWeather(date));
    setIsSidebarOpen(true);
};
```

**2. ClientCalendarSidebar Component:**
   - **Technology Used:** React, JavaScript
   - **Functionality:**
     - Displays trip types with corresponding images.
     - Handles booking interactions, allowing users to book trips based on availability.
     - Differentiates between trips that require full-boat bookings and those allowing individual seat bookings.
     - Adjusts afternoon trip offerings based on the type and status of morning bookings.

**Code Snippet:**
```javascript
const bookingTripOptions = (type, time, seats = 6) => {
    const seatsLeftText = seats === 1 ? "1 seat left!" : seats === 0 ? "0 seats left" : `${seats} seats left!`;
    const buttonOrMessage = seats === 0 ? (
        <div className="text-xs rounded-md px-3 py-1 inline-block bg-red-500 text-white">Full Boat</div>
    ) : (
        <button className="rounded-md px-3 py-1 inline-block bg-amber-400 hover:bg-amber-500 text-white w-[70px]" onClick={() => openModalWithBooking(date, time, type, seats)}>Book</button>
    );

    return (
        <div className="flex items-center gap-2 mb-2 text-xs">
            <div className="border bg-slate-200 rounded-md px-2 py-1 inline-block ml-5">{time === "am" ? "6am" : "2pm"}</div>
            {buttonOrMessage}
            <p className="text-xs">({seatsLeftText})</p>
        </div>
    );
};
```

**Challenges and Solutions:**
- **Challenge:** Handling the complex logic for trip availability based on season and time of day.
  - **Solution:** Implemented detailed state management and conditional rendering to accurately reflect the business rules.
- **Challenge:** Ensuring responsiveness and a seamless user experience across different devices.
  - **Solution:** Utilized responsive design principles and tested the interface on multiple devices to ensure consistency.

**Outcome:**
This custom solution not only met the client's specific needs but also provided a scalable and maintainable system that can be further expanded with additional features as required.
