import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const departments = await Department.find({}).sort({ createdAt: -1 });

    if (!departments || departments.length == 0) {
      return res
        .status(400)
        .json({ message: 'No se han dado de alta departamentos...' });
    }

    res.status(200).json({
      message: 'Departamentos obtenidos correctamente',
      departments_data: departments,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
