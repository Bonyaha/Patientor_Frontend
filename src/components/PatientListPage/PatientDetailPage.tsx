import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
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

	return (
		<div>
			<Typography variant="h4">Patient Information</Typography>
			{patient ? (
				<Box>
					<Typography>Name: {patient.name} {getGenderIcon(patient.gender)}</Typography>
					<Typography>ssn: {patient.ssn}</Typography>
					<Typography>Occupation: {patient.occupation}</Typography>
					{/* Add more patient information fields here */}
				</Box>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default PatientDetailPage;
