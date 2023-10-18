import { generarStringAleatorio } from '@/lib/generateTurnString';
import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import Turn from '@/models/mongoSchemas/turnScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   department_name: 'Nombre del departamento',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { department_name } = req.body;

    const department = await Department.findOne({ name: department_name });

    const validateDepartment = await ServicePoint.findOne({
      department: department._id,
      status: 'open',
    });

    if (!validateDepartment) {
      res.status(400).json({
        message:
          'No hay puntos de servicio abiertos para este departamento, por favor intenta más tarde',
      });

      return;
    }

    let turnString = '';

    let validated = false;

    while (!validated) {
      turnString = generarStringAleatorio();

      const validateTurn = await Turn.findOne({
        turn: turnString,
        $or: [{ status: 'pending' }, { status: 'attending' }],
      });

      if (!validateTurn) {
        validated = true;
      }
    }

    const newTurn = new Turn({
      turn: turnString,
      department: department._id,
    });

    await newTurn.save();

    const turnGenerated = await Turn.findOne({
      turn: turnString,
      status: 'pending',
    });

    res.status(200).json({
      message: 'Turno creado correctamente',
      turn_id: turnGenerated._id,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
