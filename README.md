# My Code Sample from Cod Mountain Fish Co. Project

This repository contains code samples from my current work project where I am working as a freelance full stack software developer. I am developing a web application for Cod Mountain Fish Co., a fishing charter company. I'm using Javascript, React, and Tailwind CSS for the frontend and Python, Flask, MongoDB for the backend.

##  Project Description

The web app features a calendar that displays:

-   Current bookings
-   Blocked days
-   Cancelled days due to weather

## Calendar and Sidebar Interaction

Depending on the screen size, a sidebar will appear to the right of the calendar or as a modal on top of the calendar. When a date on the calendar is clicked, the sidebar updates to show available trips, times, and seats for that day. If the owner is currently logged in and is on his dashboard page, the `CaptainCalendarSidebar` will render instead of the `ClientCalendarSidebar`.

-   The `ClientCalendarSidebar` and `CaptainCalendarSidebar` components are called from the `Calendar` component.

## Demo
While the web app is still in progress, you can view the demo site [here](https://cod-mountain.onrender.com/).

<img width="1440" alt="Screen Shot 2024-05-13 at 9 43 01 AM" src="https://github.com/lola831/Coding-Sample/assets/110120745/89755bdc-d6cb-4e13-9765-1f9cf4bbb183">

