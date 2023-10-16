import connectDB from '@/models/mongoConnection';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// - Ejemplo: /api/departments/getServicePoints

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const servicePoints = await ServicePoint.find({}).sort({ createdAt: -1 });

    if (!servicePoints || servicePoints.length == 0) {
      return res
        .status(400)
        .json({ message: 'No se han dado de alta puntos de servicio...' });
    }

    res.status(200).json({
      message: 'Puntos de servicio obtenidos correctamente',
      service_points_data: servicePoints,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
