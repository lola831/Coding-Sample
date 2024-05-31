import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import { generateDate, months } from "../../utils/calendar";
import cn from "../../utils/cn";
import dayjs from 'dayjs';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import CaptainCalendarSidebar from "../CaptainCalendarSidebar/CaptainCalendarSidebar";
import ClientCalendarSidebar from "../ClientCalendarSidebar/ClientCalendarSidebar";
import useWindowSize from "../../hooks/useWindowSize";

const Calendar = () => {
  const location = useLocation();
  const { userSession } = useAuth();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const abrvDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentDate = dayjs();
  var isBetween = require('dayjs/plugin/isBetween')
  dayjs.extend(isBetween)
  const [today, setToday] = useState(currentDate);
  const [blockDays, setBlockDays] = useState([])
  const [currentBookings, setCurrentBookings] = useState([])
  const [seasonDays, setSeasonDays] = useState([])
  const { width } = useWindowSize()
  // vars for side bar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [selectedDateBlocked, setSelectedDateBlocked] = useState(false);
    const [selectedDateFishingSeason, setSelectedDateFishingSeason] = useState(false)
    const [selectedDateSalmonSeason, setSelectedDateSalmonSeason] = useState(false)
    const [selectedDateBookings, setSelectedDateBookings] = useState(false)
    const [selectedDateWeather, setSelectedDateWeather] = useState(false)

  useEffect(() => {
    console.log("IN USE EFFECT 2")
    const fetchData = async () => {
      try {
        // fetch block days
        const responseBlockDays = await fetch('/api/block/all');
        const dataBlockDays = await responseBlockDays.json();
        setBlockDays(dataBlockDays.Block.Blocks)

        // fetch bookings
        const responseBookings = await fetch('/api/booking/all');
        const dataBookings = await responseBookings.json();
        // store bookings that arent cancelled
        setCurrentBookings(dataBookings.Booking.Bookings.filter(booking => !booking.cancel))
        // console.log("currentBookings: ", currentBookings)

        //fetch season days
        const responseSeasons = await fetch('/api/calendar/all');
        const dataSeasons = await responseSeasons.json();
        setSeasonDays(dataSeasons.Calendar.Calendars)
        // console.log("season days: ", seasonDays)

        // Set loading to false once all data is fetched
        // setLoading(false);

      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchData();
  }, []);

  // Function to check if a given date is a block day
  const isBlockDay = (date) => {
    return blockDays.some((blockDay) => {
      return dayjs(date).isBetween(blockDay.startDate, blockDay.endDate, null, '[]');
    });
  };

  // Function to check if a given date cancelled due to weather
  const isWeather = (date) => {
    const matchingDay = seasonDays.find((day) => {
      return day.type === "weather" && dayjs(date).isBetween(day.startDate, day.endDate, null, '[]');
    });

    return matchingDay ? matchingDay._id : false;
  };

  // Function to check if a given date is within the fishing season
  const isInFishSeason = (date) => {
    return seasonDays.some((day) => {
      // Check if the day type is "fish" and if the date falls within the start and end dates
      return day.type === "fish" && dayjs(date).isBetween(day.startDate, day.endDate, null, '[]');
    });
  };

  // Function to check if a given date is within the salmon season
  const isInSalmonSeason = (date) => {
    return seasonDays.some((day) => {
      return day.type === "salmon" && dayjs(date).isBetween(day.startDate, day.endDate, null, '[]');
    });
  };


  // Function to check bookings for that date
  const getBookingsByDay = (date) => {
    // Filter bookings for the specified date
    const bookingsForDate = currentBookings.filter(booking => dayjs(booking.date).isSame(date, 'day'));

    // If there are no bookings for the date, return null
    if (bookingsForDate.length === 0) {
      return null;
    }

    // Initialize arrays for AM and PM bookings
    const amBookings = [];
    const pmBookings = [];

    let amPartySizeTotal = 0;
    let pmPartySizeTotal = 0;
    let salmon = false;
    let tuna = false;
    let halibut = false

    // Separate bookings into AM and PM arrays
    bookingsForDate.forEach(booking => {
      if (booking.time === 'am') {
        amBookings.push(booking);
        amPartySizeTotal += booking.partySize;
      } else {
        pmBookings.push(booking);
        pmPartySizeTotal += booking.partySize;
      }

      if (booking.tripType === 'Salmon') {
        salmon = true;
      } else if (booking.tripType === 'Tuna') {
        tuna = true;
      } else if (booking.tripType === 'Halibut') {
        halibut = true
      }
    });

    // Calculate available seats
    const amSeatAvailable = Math.max(0, 6 - amPartySizeTotal);
    const pmSeatAvailable = Math.max(0, 6 - pmPartySizeTotal);

    // Get the trip type for the first booking in AM and PM arrays
    const amTripType = amBookings.length > 0 ? amBookings[0].tripType : null;
    const pmTripType = pmBookings.length > 0 ? pmBookings[0].tripType : null;

    // Return an object with AM and PM bookings arrays, seat availability, and trip types
    return {
      am: amBookings.length > 0 ? amBookings : null,
      pm: pmBookings.length > 0 ? pmBookings : null,
      amSeatAvailable,
      pmSeatAvailable,
      salmon,
      tuna,
      halibut,
      amTripType,
      pmTripType
    };
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedDateBlocked(isBlockDay(date))
    setSelectedDateFishingSeason(isInFishSeason(date))
    setSelectedDateSalmonSeason(isInSalmonSeason(date))
    setSelectedDateBookings(getBookingsByDay(date))
    setSelectedDateWeather(isWeather(date))
  }

  // refresh bookings after booking edit
  const refreshBookings = async () => {
    try {
      // Fetch updated bookings
      const responseBookings = await fetch('/api/booking/all');
      const dataBookings = await responseBookings.json();
      setCurrentBookings(dataBookings.Booking.Bookings.filter(booking => !booking.cancel))
      console.log("Bookings refreshed");
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  // refresh calendar after weather change
  const refreshCalendar = async () => {
    try {
      // Fetch updated bookings
      const responseCalendar = await fetch('/api/calendar/all');
      const dataCalendar = await responseCalendar.json();
      setSeasonDays(dataCalendar.Calendar.Calendars)
      console.log("Bookings refreshed");
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const tripImages = {
    'Tuna': './tuna.png',
    'Rockfish': './rockfish.png',
    'Wildlife': './whale.jpg',
    'Halibut': './halibut.png',
    'Salmon': './salmon.png'
  };

  const lastName = (bookings) => {
    return bookings.map(booking => (
      <p className="hidden sm:flex pl-1" key={booking._id}>{booking.lastName.substring(0, 7)} - x{booking.partySize}</p>
    ))
  }

  return (
    <div className="flex flex-col bg-white justify-center
    sm:flex-row">
      <div className="calendar-box mb-10">
        <div className="flex gap-5 bg-teal-500 border border-teal-500 justify-center p-1">
          <div className="font-semibold w-[150px]">{months[today.month()]}, {today.year()}</div>
          <div className="flex items-center gap-5">
            <GrFormPrevious className="w-5 h-5 cursor-pointer" onClick={() => {
              setToday(today.month(today.month() - 1))
            }} />
            <div className="cursor-pointer" onClick={() => {
              setToday(currentDate)
            }}>Today</div>
            <GrFormNext className="w-5 h-5 cursor-pointer" onClick={() => {
              console.log("next month")
              setToday(today.month(today.month() + 1))
            }} />
          </div>
        </div>

        {/* calendar week days */}
        {/* mobile view */}
        <div className="sm:hidden w-full grid grid-cols-7 text-gray-500">
          {abrvDays.map((day, index) => {
            let borderClass = "border-[0.5px] border-b-0";
            let thickerBorderClass = "";

            if (day === "Saturday" || day === "Sat") {
              thickerBorderClass = "border-r-0.5";
            } else if (day === "Sunday" || day === "Sun") {
              thickerBorderClass = "border-l-0.5";
            }

            return (
              <div
                className={`week-days text-sm h-8 grid place-content-center px-2 ${borderClass} ${thickerBorderClass} border-teal-500 bg-slate-200`}
                key={index}
              >
                {day}
              </div>
            );
          })}
        </div>
        {/* larger screens */}
        <div className="hidden w-full sm:grid grid-cols-7 text-gray-500">
          {days.map((day, index) => {
            let borderClass = "border-[0.5px] border-b-0";
            let thickerBorderClass = "";

            if (day === "Saturday" || day === "Sat") {
              thickerBorderClass = "border-r-0.5";
            } else if (day === "Sunday" || day === "Sun") {
              thickerBorderClass = "border-l-0.5";
            }

            return (
              <div
                className={`week-days text-sm h-8 grid place-content-center px-2 ${borderClass} ${thickerBorderClass} border-teal-500 bg-slate-200`}
                key={index}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* calendar content */}
        <div className="w-full h-[auto] grid grid-cols-7 border-[0.5px] border-teal-500">
          {generateDate(today.month(), today.year()).map(({ date, currentMonth, today }, index) => {
            const isBlocked = isBlockDay(date);
            let isBookings = null

            const isWeatherDay = isWeather(date)

            if (!isBlocked) {
              isBookings = getBookingsByDay(date)
            }

            // console.log("isBookings: ", isBookings)

            return (
              <div key={index} className="calendar-small-box min-h-[100px] text-sm border-[0.5px] border-teal-500 hover:bg-gray-100 transition-all cursor-pointer relative"
                onClick={() => { handleDateClick(date); setIsSidebarOpen(true) }}>
                <div
                  className={cn(
                    currentMonth ? "" : "text-gray-400",
                    today ? "text-white bg-teal-500" : "",
                    selectedDate.toDate().toDateString() === date.toDate().toDateString() ? "bg-black text-white" : "",
                    "h-6 w-6 grid place-content-center rounded-full hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                  )}
                >{date.date()}</div>
                {/* display block day */}
                {isBlocked && <div className="text-xs font-bold text-red-400">blocked</div>}
                {isWeatherDay && <div className="absolute top-8 transform -rotate-45 border border-red-500 bg-white text-red-500 px-1 py-1 text-xs font-bold rounded-sm left-[-8px] md:left-0 md:px-4 md:py-2">Cancelled</div>}

                {/* display if bookings for that day */}
                {isBookings ? (
                  isBookings.tuna || isBookings.salmon ? (
                    // display if tuna or salmon
                    <div className="text-xs pt-1">
                      <img className="h-5 w-12 object-contain" src={tripImages[isBookings.amTripType]} alt={isBookings.amTripType} />
                      <div className="pl-1">6am</div>
                      {lastName(isBookings.am)}
                      <div className="text-red-400 font-bold pl-1">full</div>
                    </div>
                  ) : (
                    <div className="text-xs flex flex-col">
                        <div className="am-section pb-2">
                        {!isBookings.amTripType && isBookings.pmTripType && (
                            <div className="text-teal-500 font-bold pl-1 pt-1 pb-5">am open</div>
                        )}
                      {/* display if am trips*/}
                      {isBookings.amTripType && (
                        <div className="pt-1">

                            <img className="h-5 w-12 object-contain" src={tripImages[isBookings.amTripType]} alt={isBookings.amTripType} />
                          <div className="pl-1">6am</div>

                          {lastName(isBookings.am)}
                          {/* display if full boat */}
                          {(isBookings.amSeatAvailable === 0 || isBookings.amTripType === "Halibut") ? (
                            <div className="">
                              <div className="text-red-400 font-bold pl-1">full</div>
                              {/* display if pm seats available
                              {!isBookings.pmTripType && (
                                <div className="rounded-md border bg-teal-500 text-white flex justify-center">pm open</div>
                              )} */}
                            </div>
                          ) : (
                            <div className="text-teal-500 text-xs font-bold pl-1">({isBookings.amSeatAvailable} left)</div>
                          )}
                        </div>
                      )}
                      </div>
                      <div className="pm-section">
                        {(isBookings.amSeatAvailable === 0 || isBookings.amTripType === "Halibut") && !isBookings.pmTripType && (
                             <div className="text-teal-500 font-bold pl-1">pm open</div>
                        )}
                      {/* display if pm trips */}
                      {isBookings.pmTripType && (
                        <div className="">

                            <img className="h-5 w-12 object-contain" src={tripImages[isBookings.pmTripType]} alt={isBookings.pmTripType} />
                            <div className="pl-1">2pm</div>

                          {lastName(isBookings.pm)}
                          {/* display if full boat */}
                          {(isBookings.pmSeatAvailable === 0 || isBookings.pmTripType === "Halibut") ? (
                            <div className="">
                              <div className="text-red-400 font-bold pl-1">full</div>
                            </div>
                          ) : (
                          <div className="text-xs text-teal-500 font-bold pl-1">
                            ({isBookings.pmSeatAvailable} left)
                            </div>)}
                        </div>
                      )}
                      </div>
                    </div>
                  )
                ) : null}

              </div>);
          })}
        </div>
      </div>

      {/* calendar sidebar */}
      {location.pathname === "/dashboard" && (userSession && userSession.username === 'Greg') ? (
          <div>
            <CaptainCalendarSidebar
              date={selectedDate}
              isInPast={selectedDate.isBefore(dayjs(), 'day')}
              isBlocked={selectedDateBlocked}
              isFishingSeason={selectedDateFishingSeason}
              isSalmonSeason={selectedDateSalmonSeason}
              bookings={selectedDateBookings}
              refreshBookings={refreshBookings}
              isWeather={selectedDateWeather}
              refreshCalendar={refreshCalendar}
            />
          </div>
        ) : (
            <>
            {
                (width < 862 && isSidebarOpen) && (
                    <div className="">
                      <ClientCalendarSidebar
                        date={selectedDate}
                        isInPast={selectedDate.isBefore(dayjs(), 'day')}
                        isBlocked={selectedDateBlocked}
                        isFishingSeason={selectedDateFishingSeason}
                        isSalmonSeason={selectedDateSalmonSeason}
                        bookings={selectedDateBookings}
                        refreshBookings={refreshBookings}
                        isWeather={selectedDateWeather}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                      />
                    </div>
                )
            }
            {
                width >= 862 && (
                    <div className="">
                      <ClientCalendarSidebar
                        date={selectedDate}
                        isInPast={selectedDate.isBefore(dayjs(), 'day')}
                        isBlocked={selectedDateBlocked}
                        isFishingSeason={selectedDateFishingSeason}
                        isSalmonSeason={selectedDateSalmonSeason}
                        bookings={selectedDateBookings}
                        refreshBookings={refreshBookings}
                        isWeather={selectedDateWeather}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                      />
                    </div>
                )
            }
            </>
        )
      }
    </div>
  );

}

export default Calendar;
