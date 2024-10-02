const asyncHandler = require('express-async-handler')
const UserCalendar = require('../models/user-calendar')

// create user and event or if user exists then add event 
const createEvent = asyncHandler(async (req, res) => {
    const { date, time, type, note_title, note_description, reminder } = req.body.eventDetails;
    const email = req.user.idToken.email;

    // console.log(date , time , type , note_title , note_description , reminder)
    // console.log(req.body.eventDetails)

    let userRecord = await UserCalendar.findOne({ user_email: email });

    if (!userRecord) {
        // Create new user and add the event
        userRecord = await UserCalendar.create({
            user_email: email,
            events: [
                {
                    date,
                    time,
                    type,
                    note_title,
                    note_description,
                    reminder,
                },
            ],
        });
    } else {
        // User exists, add the event to their record
        userRecord.events.push({
            date,
            time,
            type,
            note_title,
            note_description,
            reminder,
        });
        await userRecord.save();
    }

    res.status(201).json({ message: 'Event created successfully' });
});


const getEventsonDate = asyncHandler(async (req, res) => {
    const email = req.user.idToken.email;
    const { date } = req.params; 

    try{
        const userRecord = await UserCalendar.aggregate([
            { $match: { user_email: email } },
            { $unwind: '$events' },
            { $match: { 'events.date': new Date(date) } },
            { 
                $project: {
                    'events.date': 1,
                    'events.time': 1,
                    'events.type': 1,
                    'events.note_title': 1,
                }
            },
        ]);

        if (!userRecord.length) {
            return res.status(204).json({ message: 'No events found on this date' });
        }

        res.status(200).json({ events: userRecord.map((record) => record.events) });
    }
    catch(err){
        console.log(err)
    }
});


const getAllDates = asyncHandler(async (req, res) => {
    const email = req.user.idToken.email;

    if(!email){
        return res.status(400).json({message : 'Unable to retrieve the emaiol from idToken '})
    }

    try{
        const userRecord = await UserCalendar.aggregate([
            { $match: { user_email: email } },
            { $unwind: '$events' },
            { $group: { _id: '$events.date' } },
            { $project: { date: '$_id', _id: 0 } },
        ]);
        
        if (!userRecord.length) {
            return res.status(404).json({ message: 'No dates found with events' });
        }
        
        return res.status(200).json({ dates: userRecord.map((record) => record.date) });
    }
    catch(err){
        console.log(err)
    }
});

const editNote = asyncHandler(async (req, res) => {
    const email = req.user.idToken.email;
    const { eventId } = req.params
    const { updatedFields } = req.body; // Assuming `eventId` and `updatedFields` are provided

    const userRecord = await UserCalendar.findOneAndUpdate(
        { user_email: email, 'events._id': eventId },
        { $set: { 'events.$': updatedFields } },
        { new: true }
    );

    if (!userRecord) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', event: userRecord });
});


const viewNote = asyncHandler(async (req, res) => {
    const email = req.user.idToken.email;
    const { eventId } = req.params; // Assuming eventId is passed as a parameter

    const userRecord = await UserCalendar.findOne(
        { user_email: email, 'events._id': eventId },
        { 'events.$': 1 }
    );

    if (!userRecord) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event: userRecord.events[0] });
});

const deleteEvent = asyncHandler(async (req, res) => {
    const email = req.user.idToken.email;
    const { eventId } = req.params; // Assuming eventId is passed as a parameter

    const userRecord = await UserCalendar.findOneAndUpdate(
        { user_email: email },
        { $pull: { events: { _id: eventId } } },
        { new: true }
    );

    if (!userRecord) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
});

module.exports = {createEvent , getAllDates , getEventsonDate , editNote , viewNote , deleteEvent}