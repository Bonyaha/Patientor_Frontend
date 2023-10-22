import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import diagnosesService from '../../services/diagnoses';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { LocalHospital as HospitalIcon, MedicalServices as MedicalServicesIcon, Work as WorkIcon, Favorite as FavoriteIcon } from '@mui/icons-material';

import { Diagnosis, Patient, Gender, Entry, HealthCheckRating, EntryWithoutId } from "../../types";
import patientService from '../../services/patients';
import EntryForm from './EntryForm';


const assertNever = (value: never): never => {
	throw new Error(
		`Unhandled discriminated union member: ${JSON.stringify(value)}`
	);
};

const healthCheckRatingToHeartIcon = {
	[HealthCheckRating.Healthy]: <FavoriteIcon style={{ color: 'green' }} />,
	[HealthCheckRating.LowRisk]: <FavoriteIcon style={{ color: 'yellow' }} />,
	[HealthCheckRating.HighRisk]: <FavoriteIcon style={{ color: 'red' }} />,
	[HealthCheckRating.CriticalRisk]: <FavoriteIcon style={{ color: 'red' }} />
};
const cardStyle = {
	border: '1px solid #ccc',
	padding: '10px',
	margin: '10px',
	display: 'flex',
	alignItems: 'center',
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
	let icon;
	switch (entry.type) {
		case 'HealthCheck':
			const heartIcon = healthCheckRatingToHeartIcon[entry.healthCheckRating];
			icon = (
				<>
					<MedicalServicesIcon fontSize="small" />
					{heartIcon}
				</>
			);
			break;
		case 'OccupationalHealthcare':
			icon = <WorkIcon fontSize="small" />;
			break;
		case 'Hospital':
			icon = <HospitalIcon />;
			break;
		default:
			return assertNever(entry);
	}

	return (
		<Card style={cardStyle} >
			<CardContent>
				<Typography>{entry.date}{icon}</Typography>
				{renderEntryDetails(entry)}
				<Typography><i>{entry.description}</i></Typography>
				<Typography>diagnosed by {entry.specialist}</Typography>
			</CardContent>
		</Card>
	);
};

const renderEntryDetails = (entry: Entry) => {
	switch (entry.type) {
		case 'HealthCheck':
			return null; // Return null for 'HealthCheck' entries
		case 'OccupationalHealthcare':
			return <Typography>{entry.employerName}</Typography>;
		case 'Hospital':
			return <Typography>{entry.discharge.date} {entry.discharge.criteria}</Typography>;
		default:
			return assertNever(entry);
	}
};


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
	}

	//console.log(diagnoses);

	const addEntry = async (patientId: string, newEntry: EntryWithoutId) => {
		try {
			console.log(patientId);
			console.log(newEntry);

			const response = await patientService.addEntry(patientId, newEntry);

			if (response.status === 'OK') {
				const updatedPatient = response.patient as Patient;
				setPatient(updatedPatient);
			} else {

				console.error('Error adding entry:', response.error);
				return false;
			}
		} catch (error) {
			console.error('Error adding entry:', error);
			return false;
		}
	};


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
								<EntryDetails entry={entry} />


								{entry.diagnosisCodes ? (
									<div>
										<Typography variant="h5">Codes:</Typography>
										<Card style={cardStyle}>
											<CardContent>
												<List dense disablePadding>
													{entry.diagnosisCodes.map((code, codeIndex) => (
														<ListItem key={codeIndex}>
															<ListItemText primary={code} secondary={getDiagnosisDescription(code)} />
														</ListItem>
													))}
												</List>
											</CardContent>
										</Card>
									</div>
								) : null}


							</div>
						))
						: 'No data'}
					<EntryForm patient={patient} addEntry={addEntry} />
				</Box>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default PatientDetailPage;
