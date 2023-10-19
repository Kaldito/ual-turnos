import connectDB from '@/models/mongoConnection';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   department_id: 'ID del departamento',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { service_point_id } = req.body;

    await ServicePoint.updateOne(
      { _id: service_point_id },
      { available: true }
    );

    res
      .status(200)
      .json({ message: 'Punto de servicio activado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
