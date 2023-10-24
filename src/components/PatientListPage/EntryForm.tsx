import React, { useState } from 'react';
import {
	Patient,
	HealthCheckRating,
	EntryWithoutId,
	Diagnosis
} from "../../types";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button, Grid, Checkbox, ListItemText
} from '@mui/material';

interface EntryFormProps {
	patient: Patient;
	addEntry: (patientId: string, entry: EntryWithoutId) => Promise<void>;
	closeModal: () => void;
	diagnoses: Diagnosis[];
}

const EntryForm: React.FC<EntryFormProps> = ({ patient, addEntry, closeModal, diagnoses }) => {
	const [entryType, setEntryType] = useState('HealthCheck');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [specialist, setSpecialist] = useState('');
	const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
	const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
	const [employerName, setEmployerName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [dischargeDate, setDischargeDate] = useState('');
	const [dischargeCriteria, setDischargeCriteria] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		let entry: EntryWithoutId;

		switch (entryType) {
			case 'HealthCheck':
				entry = {
					type: 'HealthCheck',
					description,
					date,
					specialist,
					diagnosisCodes,
					healthCheckRating,
				};
				break;
			case 'OccupationalHealthcare':
				entry = {
					type: 'OccupationalHealthcare',
					description,
					date,
					specialist,
					diagnosisCodes,
					employerName,
					sickLeave: {
						startDate,
						endDate,
					},
				};
				break;
			case 'Hospital':
				entry = {
					type: 'Hospital',
					description,
					date,
					specialist,
					diagnosisCodes,
					discharge: {
						date: dischargeDate,
						criteria: dischargeCriteria,
					},
				};
				break;
			default:
				throw new Error('Unexpected entry type');
		}
		console.log(entry);

		try {
			await addEntry(patient.id, entry);
			closeModal();
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
			} else {
				console.log('An error occurred');
			}
		}
	};
	console.log(diagnoses);


	return (
		<form onSubmit={handleSubmit}>
			<div style={{ marginTop: '16px' }}>
				<FormControl variant="outlined" fullWidth>
					<InputLabel>Entry Type</InputLabel>
					<Select
						value={entryType}
						onChange={(e) => setEntryType(e.target.value as string)}
						label="Entry Type"
					>
						<MenuItem value="HealthCheck">Health Check</MenuItem>
						<MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
						<MenuItem value="Hospital">Hospital</MenuItem>
					</Select>
				</FormControl>
			</div>
			<br />

			<TextField
				label="Description"
				variant="outlined"
				fullWidth
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				required
			/>
			<br />
			<div style={{ marginTop: '16px' }}>
				<InputLabel>Date</InputLabel>
				<TextField
					variant="outlined"
					fullWidth
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					required
				/>
				<br />
			</div>
			<div style={{ marginTop: '16px' }}>
				<TextField
					label="Specialist"
					variant="outlined"
					fullWidth
					value={specialist}
					onChange={(e) => setSpecialist(e.target.value)}
					required
				/>
				<br />
			</div>

			<FormControl fullWidth>
				<InputLabel>Diagnosis Codes</InputLabel>
				<Select
					multiple
					value={diagnosisCodes}
					onChange={(event) => {
						setDiagnosisCodes(Array.isArray(event.target.value) ? event.target.value : [event.target.value])
					}}
					renderValue={(selected) => selected} // Display selected codes as a comma-separated list
				>
					{diagnoses.map((code) => (
						<MenuItem key={code.code} value={code.code}>
							<Checkbox checked={diagnosisCodes.includes(code.code)} />
							<ListItemText primary={code.code} />
						</MenuItem>
					))}
				</Select>
			</FormControl>


			<div style={{ marginTop: '16px' }}>
				{entryType === 'HealthCheck' && (
					<FormControl variant="outlined" fullWidth>
						<InputLabel>Health Check Rating</InputLabel>
						<Select
							value={healthCheckRating}
							onChange={(e) => setHealthCheckRating(e.target.value as HealthCheckRating)}
							label="Health Check Rating"
						>
							<MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
							<MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
							<MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
							<MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk</MenuItem>
						</Select>
					</FormControl>
				)}
			</div>

			{entryType === 'OccupationalHealthcare' && (
				<div>
					<TextField
						label="Employer Name"
						variant="outlined"
						fullWidth
						value={employerName}
						required
						onChange={(e) => setEmployerName(e.target.value)}
					/>
					<InputLabel>Sick Leave</InputLabel>
					<TextField
						variant="outlined"
						fullWidth
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<TextField
						variant="outlined"
						fullWidth
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
				</div>
			)}

			{entryType === 'Hospital' && (
				<div>
					<InputLabel>Discharge date</InputLabel>
					<TextField
						variant="outlined"
						fullWidth
						type="date"
						value={dischargeDate}
						onChange={(e) => setDischargeDate(e.target.value)}
					/>
					<TextField
						label="Discharge Criteria"
						variant="outlined"
						fullWidth
						value={dischargeCriteria}
						onChange={(e) => setDischargeCriteria(e.target.value)}
					/>
				</div>
			)}

			<Grid container justifyContent="space-between">
				<Grid item>
					<Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={closeModal}>
						Cancel
					</Button>
				</Grid>
				<Grid item>
					<Button type="submit" variant="contained" color="primary">
						Add
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

export default EntryForm;
