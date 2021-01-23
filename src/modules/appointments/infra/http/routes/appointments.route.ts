import { Router } from 'express';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req, res) => {
//   const appointments = await appointmentsRepository.find();

//   return res.json(appointments);
// });

appointmentsRouter.post('/', async (req, res) => {
  const { provider_id, date } = req.body;

  const appointmentsRepository = new AppointmentsRepository();

  const parseDate = parseISO(date);

  const createAppointment = new CreateAppointmentService(
    appointmentsRepository,
  );
  const appointment = await createAppointment.execute({
    date: parseDate,
    provider_id,
  });

  return res.json(appointment);
});

export default appointmentsRouter;
