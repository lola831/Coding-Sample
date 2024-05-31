# My Code Sample from Cod Mountain Fish Co. Project

This repository contains a code sample from my current work project where I am working as a freelance full stack software developer. I am developing a web application for Cod Mountain Fish Co., a fishing charter company.

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
