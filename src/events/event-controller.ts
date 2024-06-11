import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import { User } from '../auth/types/response';



class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }



      getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
          const { query, sortField, sortOrder, page, pageSize } = req.query;
          const events = await this.eventService.getEvents(
            query as string,
            sortField as string,
            sortOrder as string,
            Number(page),
            Number(pageSize)
          );
          res.status(200).json(events);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

    


    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }


      
      getEventsByCity = async (req: Request, res: Response): Promise<void> => {
        try {
          const location = (req as any).user.location
          console.log(location)
          
          const events = await this.eventService.getEventsByCity(location);
          res.status(200).json(events);
        }
        catch {
          res.status(500).send({error: 'Error fetching events'})
        }
      }

      updateEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const updateEventDto: CreateEventDto = req.body;
          const event = await this.eventService.updateEvent(id, updateEventDto);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        }
        catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

      deleteEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          await this.eventService.deleteEvent(id);
          res.status(204).send();
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default EventController;