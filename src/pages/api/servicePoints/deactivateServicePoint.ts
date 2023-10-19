import connectDB from '@/models/mongoConnection';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   service_point_id: 'ID del punto de servicio',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { service_point_id } = req.body;

    const validateServicePoint = await ServicePoint.findOne({
      _id: service_point_id,
      status: 'open',
    });

    if (validateServicePoint) {
      return res.status(400).json({
        message: 'No se puede desactivar un punto de servicio que este abierto',
      });
    }

    await ServicePoint.updateOne(
      { _id: service_point_id },
      { available: false }
    );

    res
      .status(200)
      .json({ message: 'Se ha deasactivado el punto de servicio' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
