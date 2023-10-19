import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';

import { Diagnosis, Patient, Gender } from "../../types";
import TransgenderIcon from '@mui/icons-material/Transgender';


const PatientDetailPage = () => {
	const params = useParams();
	const id = params.id as string; // Extract and cast id to string
	const [patient, setPatient] = useState<Patient | null>(null);
	const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

	useEffect(() => {
		const fetchPatientData = async () => {
			try {
				const patientData = await patientService.getById(id);
				setPatient(patientData);
			} catch (error) {
				console.error('Error fetching patient data:', error);
			}
		};
		const fetchDiagnoses = async () => {
			try {
				const diagnosesData = await diagnosesService.getAllDiagnoses();
				setDiagnoses(diagnosesData);
			} catch (error) {
				console.error('Error fetching diagnoses:', error);
			}
		};

		void fetchPatientData();
		void fetchDiagnoses();
	}, [id]);


	const getGenderIcon = (gender: Gender) => {
		if (gender === 'male') {
			return <MaleIcon />;
		} else if (gender === 'female') {
			return <FemaleIcon />;
		} else {
			return <TransgenderIcon />;
		}

	};

	const getDiagnosisDescription = (code: string) => {
		if (diagnoses) {
			const diagnosis = diagnoses.find((d) => d.code === code);
			return diagnosis ? diagnosis.name : "Unknown";
		}
		return "Loading...";
	};


	console.log(diagnoses);
	console.log(patient);


	return (
		<div>
			{patient ? (
				<Box>
					<Typography variant="h4">{patient.name} {getGenderIcon(patient.gender)}</Typography>
					<Typography>ssn: {patient.ssn}</Typography>
					<Typography>occupation: {patient.occupation}</Typography>
					<Typography variant="h5">Entries:</Typography>
					{patient.entries.length > 0 ?

						patient.entries.map((entry, index) => (
							<div key={index}>
								<Typography>{entry.date} <i>{entry.description}</i></Typography>
								{entry.diagnosisCodes ? (
									<List dense disablePadding>
										{entry.diagnosisCodes.map((code, codeIndex) => (
											<ListItem key={codeIndex}>
												<ListItemText primary={code} secondary={getDiagnosisDescription(code)} />
											</ListItem>
										))}
									</List>
								) : null}
							</div>
						))
						: 'No data'}

				</Box>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default PatientDetailPage;
