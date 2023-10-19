import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import patientService from '../../services/patients';
import { Patient, Gender } from "../../types";
import TransgenderIcon from '@mui/icons-material/Transgender';


const PatientDetailPage = () => {
	const params = useParams();
	const id = params.id as string; // Extract and cast id to string
	const [patient, setPatient] = useState<Patient | null>(null);

	useEffect(() => {
		const fetchPatientData = async () => {
			try {
				const patientData = await patientService.getById(id);
				setPatient(patientData);
			} catch (error) {
				console.error('Error fetching patient data:', error);
			}
		};

		void fetchPatientData();
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

	console.log(patient);

	return (
		<div>
			{patient ? (
				<Box>
					<Typography variant="h4">{patient.name} {getGenderIcon(patient.gender)}</Typography>
					<Typography>ssn: {patient.ssn}</Typography>
					<Typography>occupation: {patient.occupation}</Typography>
					<Typography variant="h5">Entries:</Typography>
					<Typography>{patient.entries[0].date} <i>{patient.entries[0].description}</i></Typography>
					{patient.entries[0].diagnosisCodes ? (
						<>
							{/* <Typography variant="h6">Diagnosis Codes:</Typography> */}
							<List dense disablePadding>
								{patient.entries[0].diagnosisCodes.map((code, index) => (
									<ListItem key={index}>
										<ListItemText primary={code} />
									</ListItem>
								))}
							</List>
						</>
					) : null}
				</Box>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default PatientDetailPage;
