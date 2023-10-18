import connectDB from '@/models/mongoConnection';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import Turn from '@/models/mongoSchemas/turnScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   service_point_id: 'ID del punto de servicio',
//   newStatus: 'Nuevo estado del punto de servicio',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { service_point_id, newStatus } = req.body;

    if (newStatus == 'closed') {
      await Turn.findOneAndUpdate(
        { servicePoint: service_point_id, status: 'attending' },
        { status: 'attended' }
      );
    }

    await ServicePoint.findByIdAndUpdate(service_point_id, {
      status: newStatus,
    });

    res
      .status(200)
      .json({ message: 'Se cambio el estado del punto de servicio' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
