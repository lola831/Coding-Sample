# Code Sample from Cod Mountain Fish Co. Project

This repository contains code samples from my current work project where I am working as a freelance full stack software developer. I am developing a web application for Cod Mountain Fish Co., a fishing charter company. I'm using JavaScript, React, and Tailwind CSS for the frontend, and Python, Flask, and MongoDB for the backend.

##  Project Description

The web app features a calendar that displays:

-   Current bookings
-   Blocked days
-   Cancelled days due to weather

## Calendar and Sidebar Interaction

Depending on the screen size, a sidebar will appear to the right of the calendar or as a modal on top of the calendar. When a date on the calendar is clicked, the sidebar updates to show available trips, times, and seats for that day. Users can proceed to book their trip by clicking on the book button. If the owner is currently logged in and is on their dashboard page, the `CaptainCalendarSidebar` will render instead of the `ClientCalendarSidebar`.

-   The `ClientCalendarSidebar` and `CaptainCalendarSidebar` components are called from the `Calendar` component.

## Demo
While the web app is still in progress, you can view the demo site [here](https://cod-mountain.onrender.com/). Once on the site, click the "Availability" page to view the calendar and sidebar. Also, feel free to check out my portfolio at [wwww.lolamarrero.com](www.lolamarrero.com).

<img width="1440" alt="Screen Shot 2024-05-13 at 9 43 01 AM" src="https://github.com/lola831/Coding-Sample/assets/110120745/89755bdc-d6cb-4e13-9765-1f9cf4bbb183">


---

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

---
