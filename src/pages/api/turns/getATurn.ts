import connectDB from '@/models/mongoConnection';
import Turn from '@/models/mongoSchemas/turnScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// {
//   service_point_department: 'Departamento del punto de servicio',
//   service_point_id: 'ID del punto de servicio',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { service_point_department, service_point_id, my_user_id } =
      req.query;

    const turns = await Turn.find({
      department: service_point_department,
      status: 'pending',
    });

    if (!turns || turns.length === 0) {
      return res.status(404).json({ message: 'No hay turnos en espera' });
    }

    await Turn.findOneAndUpdate(
      { servicePoint: service_point_id, status: 'attending' },
      { status: 'attended' }
    );

    await Turn.findByIdAndUpdate(turns[0]._id, {
      servicePoint: service_point_id,
      user: my_user_id,
      status: 'attending',
    });

    res.status(200).json({
      message: 'Turno asignado',
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
