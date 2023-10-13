import connectDB from '@/models/mongoConnection';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// - department_id: ID del departamento
// - Ejemplo: /api/departments/getServicePoints?department_id=60f9b0b9e1b7b5a9b8b3b3b3

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { department_id } = req.query;

    const servicePoints = await ServicePoint.find({
      department: department_id,
    }).sort({ createdAt: -1 });

    if (!servicePoints || servicePoints.length == 0) {
      return res
        .status(400)
        .json({ message: 'No se han dado de alta puntosa de servicio...' });
    }

    res.status(200).json({
      message: 'Departamentos obtenidos correctamente',
      service_points_data: servicePoints,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
