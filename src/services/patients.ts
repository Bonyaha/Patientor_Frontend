import axios from "axios";
import { Patient, PatientFormValues, EntryWithoutId } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getById = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (patientId: string, newEntry: EntryWithoutId) => {
  try {
    console.log(patientId);
    console.log(newEntry);

    const response = await axios.post(`${apiBaseUrl}/patients/${patientId}/entries`, newEntry);

    if (response.status === 201) {
      return { status: 'OK', patient: response.data };
    } else {
      return { status: 'Error', error: response.data.error };
    }
  } catch (error) {
    return { status: 'Error', error: 'Failed to add entry' };
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll, getById, create, addEntry
};

