import React, { useState } from 'react'
import BookingModal from '../BookingModal/BookingModal';
import dayjs from 'dayjs';
import useWindowSize from "../../hooks/useWindowSize";
import { IoMdClose } from "react-icons/io";

function ClientCalendarSidebar({ date, isInPast, isBlocked, isFishingSeason, isSalmonSeason, bookings, refreshBookings, isWeather, setIsSidebarOpen }) {
    const currentDate = dayjs();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { width } = useWindowSize()
    let availableToBook = false



    const tripImages = {
        'Rockfish': './rockfish.png',
        'Halibut': './halibut.png',
        'Wildlife': './whale.jpg',
        'Tuna': './tuna.png',
        'Salmon': './salmon.png'
    };

    const bookingTripTitle = (type) => {
        return (
            <div className="flex items-center gap-2">
                <img src={tripImages[type]} alt={type} className="h-10 w-10 object-contain" />
                <p>{type}</p>
            </div>
        )
    }

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

    const alreadyBookings = () => {
        let tripTypes = ["Rockfish", "Halibut", "Wildlife"]

        // am booking and no pm booking
        if (bookings.amTripType && !bookings.pmTripType) {
            const types = tripTypes.filter(item => item !== bookings.amTripType)
            // console.log("array", types)
            return (
                <div className='flex-col'>
                    <div key={bookings.amTripType} className="border rounded-md p-2 mt-3 bg-white">
                        {/* trip type title */}
                        {bookingTripTitle(bookings.amTripType)}
                        {/* morning charters */}
                        {bookingTripOptions(bookings.amTripType, "am", bookings.amTripType === "Halibut" ? 0 : bookings.amSeatAvailable)}
                        {/* afternoon charters */}
                        {bookingTripOptions(bookings.amTripType, "pm")}
                    </div>
                    <div key={types[0]} className="border rounded-md p-2 mt-3 bg-white">
                        {/* trip type title */}
                        {bookingTripTitle(types[0])}
                        {/* afternoon charters */}
                        {bookingTripOptions(types[0], "pm")}
                    </div>
                    <div key={types[1]} className="border rounded-md p-2 mt-3 bg-white">
                        {/* trip type title */}
                        {bookingTripTitle(types[1])}
                        {/* afternoon charters */}
                        {bookingTripOptions(types[1], "pm")}
                    </div>
                </div>
            )
        }

        // am booking and pm booking
        if (bookings.amTripType && bookings.pmTripType) {
            return (
                <div className='flex-col'>
                    <div className="border rounded-md p-2 mt-3 bg-white">
                        {/* trip type title */}
                        {bookingTripTitle(bookings.amTripType)}
                        {/* morning charters */}
                        {bookingTripOptions(bookings.amTripType, "am", bookings.amTripType === "Halibut" ? 0 : bookings.amSeatAvailable)}
                        {/* afternoon charters */}
                        {/* afternoon charter same as morning charter */}
                        {bookings.amTripType === bookings.pmTripType ? (
                            <>
                                {bookingTripOptions(bookings.pmTripType, "pm", bookings.pmTripType === "Halibut" ? 0 : bookings.pmSeatAvailable)}
                            </>
                        ) : (
                            <>
                                {/* afternoon charter different than morning charter */}
                                {/* trip type title */}
                                {bookingTripTitle(bookings.pmTripType)}
                                {/* morning charters */}
                                {bookingTripOptions(bookings.pmTripType, "pm", bookings.pmTripType === "Halibut" ? 0 : bookings.pmSeatAvailable)}
                            </>
                        )}
                    </div>
                </div>
            )
        }

        // pm booking and no am booking
        if (bookings.pmTripType && !bookings.amTripType) {
            // console.log("array", tripTypes)
            const types = tripTypes.filter(item => item !== bookings.pmTripType)
            // console.log("pm trip", bookings.pmTripType)
            // console.log("array", tripTypes)
            return (
                <div className='flex-col'>
                    <div className="border rounded-md p-2 mt-3 bg-white">
                        {/* trip type title */}
                        {bookingTripTitle(bookings.pmTripType)}
                        {/* morning charters */}
                        {bookingTripOptions(bookings.pmTripType, "am")}
                        {/* afternoon charters */}
                        {bookingTripOptions(bookings.pmTripType, "pm", bookings.pmTripType === "Halibut" ? 0 : bookings.pmSeatAvailable)}
                    </div>
                    <div className="border rounded-md p-2 mt-3 bg-white">
                        {/* trip type title */}
                        {bookingTripTitle(types[0])}
                        {/* afternoon charters */}
                        {bookingTripOptions(types[0], "am")}
                    </div>
                    <div className="border rounded-md p-2 mt-3 bg-white">
                        {/* trip type title */}
                        {bookingTripTitle(types[1])}
                        {/* afternoon charters */}
                        {bookingTripOptions(types[1], "am")}
                    </div>
                </div>
            )
        }

    }

    const openBookingDay = () => (
        <div className='flex-col'>
            {Object.keys(tripImages).map((type) => (
                <>
                    {type === "Salmon" && !isSalmonSeason ? null : (
                        <div className="border rounded-md p-2 mt-3 bg-white">
                            {/* trip type title */}
                            {bookingTripTitle(type)}
                            {/* morning charters */}
                            {bookingTripOptions(type, "am")}
                            {/* afternoon charters */}
                            {["Halibut", "Rockfish", "Wildlife"].includes(type) && (
                                bookingTripOptions(type, "pm")
                            )}
                        </div>
                    )}
                </>
            ))}
        </div>
    )

    const tunaOrSalmonBooking = (type) => {
        return (
            <div className="border rounded-md p-2 mt-2 bg-white">
                <div className="flex items-center gap-2">
                    <img src={tripImages[type]} alt={type} className="h-10 w-10 object-contain" />
                    <p>{type} Trip</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs border rounded-md px-2 py-1 inline-block ml-5 bg-slate-200">6am</div>
                    <div className="text-xs rounded-md px-3 py-1 inline-block bg-red-500 text-white ">Full Boat</div>
                    <p className="text-xs">(0 seats left)</p>
                </div>
            </div>
        )
    }

    const checkAvailability = () => {
        if (date.isSame(currentDate, 'day')) return <div className={`${width < 862 ? 'p-3 border rounded-b-md text-sm h-[100px] mt-0 m-[-20px] bg-white' : 'p-3 border rounded-b-md text-sm text-slate-500 h-[100px] mt-0 m-[-20px] bg-white'}`}>You must call 831-419-8443 to make same day reservation.</div>
        if (isInPast) return <div className={`${width < 862 ? 'p-3 border rounded-b-md text-sm h-[100px] mt-0 m-[-20px] bg-white' : 'p-3 border rounded-b-md text-sm text-slate-500 h-[100px] mt-0 m-[-20px] bg-white'}`}>This date is in the past, please choose a new date.</div>
        if (isBlocked) return <div className={`${width < 862 ? 'p-3 border rounded-b-md text-sm h-[100px] mt-0 m-[-20px] bg-white' : 'p-3 border rounded-b-md text-sm text-slate-500 h-[100px] mt-0 m-[-20px] bg-white'}`}>This date is blocked, please choose a new date.</div>
        if (isWeather) return <div className={`${width < 862 ? 'p-3 border rounded-b-md text-sm h-[100px] mt-0 m-[-20px] bg-white' : 'p-3 border rounded-b-md text-sm text-slate-500 h-[100px] mt-0 m-[-20px] bg-white'}`}>Cancelled due to weather</div>
        if (!isFishingSeason) return <div className={`${width < 862 ? 'p-3 border rounded-b-md text-sm h-[100px] mt-0 m-[-20px] bg-white' : 'p-3 border rounded-b-md text-sm text-slate-500 h-[100px] mt-0 m-[-20px] bg-white'}`}>Fishing Season Closed, please choose a new date.</div>
        if (bookings && (bookings.tuna || bookings.salmon)) return tunaOrSalmonBooking(bookings.tuna ? "Tuna" : "Salmon")

        return availableToBook = true
    };

    const openModalWithBooking = (date, time, tripType, seatsOpen) => {

        const booking = {
            date: date.format('ddd MMM DD YYYY'),
            time,
            tripType,
            seatsOpen
        };
        console.log("booking details", booking)
        setSelectedBooking(booking);
        setIsModalOpen(true);

    };

    return (
        <div className={`${width < 862 && !isModalOpen ? 'fixed top-0 left-0 z-50 flex justify-center h-screen w-screen bg-opacity-50 bg-slate-900 overflow-y-auto' :
            ''}`}>

            <div className={`booking-options-box flex flex-col w-[310px] ${width < 862 && !isModalOpen ? 'absolute top-5 left-1/2 right-1/2 transform -translate-x-1/2 bottom-0 z-10 h-[auto] flex overscroll-contain' :
                'ml-5'}`}>

                <div className={`bg-teal-500 rounded-md p-5 ${width < 862 && !isModalOpen ? 'pb-5' : ''}`}>
                    <div className={`font-bold flex justify-between ${width < 862 && !isModalOpen ? 'pb-2' : "pb-5"}`}>{date.format('ddd MMM DD YYYY')} {width < 862 && (<button className="" onClick={() => setIsSidebarOpen(false)}><IoMdClose className="text-xl" /></button>)}</div>
                    {checkAvailability()}
                    {/* open availability */}
                    {availableToBook && !bookings && (
                        <div className='flex-col'>
                            {openBookingDay()}
                        </div>
                    )}
                    {availableToBook && bookings && (
                        <div className='flex-col'>
                            {alreadyBookings()}
                        </div>
                    )}
                </div>
                <BookingModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedBooking={selectedBooking}
                    refreshBookings={refreshBookings}
                    setIsSidebarOpen={setIsSidebarOpen} />
            </div>
        </div>

    )
}

export default ClientCalendarSidebar
