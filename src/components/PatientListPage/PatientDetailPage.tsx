import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Box, Typography, List, ListItem, ListItemText, Card, CardContent, Dialog, DialogTitle, DialogContent, Alert, Divider } from '@mui/material';
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
	[HealthCheckRating.HighRisk]: <FavoriteIcon style={{ color: 'orange' }} />,
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
			return (
				<div>
					<Typography>{entry.employerName}</Typography>
					<Typography>Sick leave:</Typography>
					<Typography>Start date: {entry.sickLeave?.startDate}</Typography>
					<Typography>End date: {entry.sickLeave?.endDate}</Typography>
				</div>
			);
		case 'Hospital':
			return (
				<div>
					<Typography>Discharge date:{entry.discharge.date}</Typography>
					<Typography>Criteria:{entry.discharge.criteria}</Typography>
				</div>

			)
		default:
			return assertNever(entry);
	}
};


const PatientDetailPage = () => {
	const params = useParams();
	const id = params.id as string; // Extract and cast id to string
	const [patient, setPatient] = useState<Patient | null>(null);
	const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [error, setError] = useState<string>('');
	const [showAlert, setShowAlert] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		//setError('');
	};

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
	}, []);


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
			const response = await patientService.addEntry(patientId, newEntry);
			console.log(response);

			if (response.status === 'OK') {
				const updatedPatient = response.patient as Patient;
				console.log(updatedPatient);

				setPatient(updatedPatient);
			} else {
				setError(response.error || 'An error occurred');
				setShowAlert(true);
				setTimeout(() => {
					setShowAlert(false);
				}, 5000);
			}
		} catch (error: any) {
			console.error('Error adding entry:', error);
			setError(error || 'An error occurred');
			setShowAlert(true);
			setTimeout(() => {
				setShowAlert(false);
			}, 5000);
		}
	};

	console.log(isModalOpen);
	console.log(error);



	return (
		<div>
			{showAlert && <Alert severity="error">{error}</Alert>}
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


								{entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
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
					<Button variant="contained" color="primary" onClick={openModal}>
						Add New Entry
					</Button>
					<Dialog fullWidth={true} open={isModalOpen} onClose={() => closeModal()}>
						<DialogTitle>Add a new patient</DialogTitle>
						<Divider />
						<DialogContent>

							<EntryForm patient={patient} addEntry={addEntry} closeModal={closeModal} diagnoses={diagnoses} />
						</DialogContent>
					</Dialog>
				</Box>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default PatientDetailPage;
