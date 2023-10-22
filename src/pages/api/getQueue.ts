import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import Turn from '@/models/mongoSchemas/turnScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// {
//   department_name: 'Nombre del departamento',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { department_name } = req.query;

    const department = await Department.findOne({
      name: department_name,
    });

    const queue = await Turn.find({
      department: department._id,
      status: 'pending',
    });

    console.log(queue);

    if (!queue || queue.length === 0) {
      return res.status(404).json({ message: 'No hay turnos en espera' });
    }

    res.status(200).json({
      message: 'Fila obtenida',
      queue_data: queue,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
