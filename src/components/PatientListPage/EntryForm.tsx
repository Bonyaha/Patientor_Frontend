/* import React, { useState } from 'react';
import { Patient, HealthCheckRating } from "../../types";

interface EntryFormProps {
	patient: Patient;
	addEntry: (patientId: string, entry: any) => Promise<boolean | undefined>;
}


const EntryForm: React.FC<EntryFormProps> = ({ patient, addEntry }) => {
	const [entryType, setEntryType] = useState('HealthCheck'); // Default to HealthCheck
	const [description, setDescription] = useState('');
	const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Construct the entry object based on the selected entryType and field values
		const entry = {
			type: entryType,
			description,
			healthCheckRating,
		};

		try {
			await addEntry(patient.id, entry);
			// Clear the form fields or perform other actions as needed
		} catch (error) {
			// Handle errors and show an error message to the user
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Entry Type:
				<select value={entryType} onChange={(e) => setEntryType(e.target.value)}>
					<option value="HealthCheck">Health Check</option>
					<option value="OccupationalHealthcare">Occupational Healthcare</option>
					<option value="Hospital">Hospital</option>
				</select>
			</label>
			<br />

			<label>
				Description:
				<input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
			</label>
			<br />

			<div>
				<label>
					Health Check Rating:
					<select
						value={healthCheckRating}
						onChange={(e) => setHealthCheckRating(Number(e.target.value))}
					>
						<option value={0}>Healthy</option>
						<option value={1}>Low Risk</option>
						<option value={2}>High Risk</option>
						<option value={3}>Critical Risk</option>
					</select>
				</label>
			</div>

			<button type="submit">Add Entry</button>
		</form>
	);
};

export default EntryForm;
 */

import React, { useState } from 'react';
import {
	Patient,
	HealthCheckRating,
	EntryWithoutId
} from "../../types";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
} from '@mui/material';

interface EntryFormProps {
	patient: Patient;
	addEntry: (patientId: string, entry: EntryWithoutId) => Promise<boolean | undefined>;
}

const EntryForm: React.FC<EntryFormProps> = ({ patient, addEntry }) => {
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

	const handleAddDiagnosisCode = () => {
		// You can implement this function to add diagnosis codes to the state
	};

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

		try {
			await addEntry(patient.id, entry);
			// Clear the form fields or perform other actions as needed
		} catch (error) {
			// Handle errors and show an error message to the user
		}
	};

	return (
		<form onSubmit={handleSubmit}>
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
			<br />

			<TextField
				label="Description"
				variant="outlined"
				fullWidth
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<br />

			<TextField
				label="Date"
				variant="outlined"
				fullWidth
				value={date}
				onChange={(e) => setDate(e.target.value)}
			/>
			<br />

			<TextField
				label="Specialist"
				variant="outlined"
				fullWidth
				value={specialist}
				onChange={(e) => setSpecialist(e.target.value)}
			/>
			<br />

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

			{entryType === 'OccupationalHealthcare' && (
				<TextField
					label="Employer Name"
					variant="outlined"
					fullWidth
					value={employerName}
					onChange={(e) => setEmployerName(e.target.value)}
				/>
			)}

			{entryType === 'OccupationalHealthcare' && (
				<div>
					<TextField
						label="Start Date"
						variant="outlined"
						fullWidth
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<TextField
						label="End Date"
						variant="outlined"
						fullWidth
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
				</div>
			)}

			{entryType === 'Hospital' && (
				<div>
					<TextField
						label="Discharge Date"
						variant="outlined"
						fullWidth
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

			{/* Add more conditionally rendered fields based on the entry type */}
			{/* You can also add buttons to add diagnosis codes and other fields as needed */}

			<Button type="submit" variant="contained" color="primary">
				Add Entry
			</Button>
		</form>
	);
};

export default EntryForm;
