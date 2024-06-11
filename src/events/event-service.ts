import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { Event } from './types/response';



// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {

    async deleteEvent(id :string): Promise<void> {
     await EventModel.findByIdAndDelete(id).exec();
     return;
    }

    async updateEvent(id: string, updateEventDto: CreateEventDto): Promise<IEvent | null> {
      const { name, description, date, location, duration } = updateEventDto;
      return await EventModel.findByIdAndUpdate(
        id,
        { name, description, date, location, duration },
        { new: true }
      ).exec();
    }

  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

    async getEvents(query = '', sortField = 'date', sortOrder = 'asc', page = 1, pageSize = 2): Promise<IEvent[]> {
      const skip = (page - 1) * pageSize;
      const sortDirection = sortOrder === 'asc' ? 1 : -1;
      return await EventModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .exec(); 
    }

    async getEventsByCity(location: string): Promise<IEvent[]> {
      return await EventModel.find({ location }).exec();
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, location ,duration} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        location,
        duration
      });
  
      await newEvent.save();
      return newEvent;
    }
  
    
  }
  
  export default EventService;
  