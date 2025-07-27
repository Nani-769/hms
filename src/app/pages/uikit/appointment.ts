import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { NameInitialsPipe } from '../../name-initials.pipe';
import { LoginserviceService } from '../service/loginservice.service';
import { ProductService } from '../service/product.service';

interface Appointment {
    patientName: string;
    appointmentDate: Date;
    department: string;
    doctor: string;
    status: string;
    reason: string;
}

@Component({
    selector: 'app-AppointmentCreationComponent',
    standalone: true,
    imports: [CommonModule, InputTextModule, ChipModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, NameInitialsPipe, RadioButtonModule, SelectButtonModule, CalendarModule, InputMaskModule, TableModule, TabsModule, TagModule, DialogModule, InputNumberModule, DropdownModule],
    providers: [ProductService],
    template: `<div class="card">
        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0">Appointments</p-tab>
                <p-tab value="1">Create Appointment</p-tab>
            </p-tablist>
            <p-tabpanels>
                <p-tabpanel value="0">
                    <div style="height: 441px; overflow-y: auto;">
                        <p-table [value]="appointments" stripedRows>
                            <ng-template pTemplate="header">
                                <tr>
                                    <th style="min-width:1rem">
                                        <div class="flex items-left">
                                            <p-selectbutton [options]="statusOptions" [(ngModel)]="filterValue" optionLabel="label" optionValue="value" aria-labelledby="basic" (onChange)="onGetType()" />
                                        </div>
                                    </th>
                                    <th style="min-width:20rem">Patient Name</th>
                                    <th style="min-width:4rem">
                                        <div class="flex items-center">
                                            Date & Time
                                            <p-columnFilter type="date" field="appointmentDate" display="menu" />
                                        </div>
                                    </th>
                                    <th style="min-width:4rem">
                                        <div class="flex items-center">
                                            Department
                                            <p-columnFilter type="text" field="department" display="menu" />
                                        </div>
                                    </th>
                                    <th style="min-width:4rem">
                                        <div class="flex items-center">
                                            Doctor
                                            <p-columnFilter type="text" field="doctor" display="menu" />
                                        </div>
                                    </th>
                                    <th style="min-width:4rem">Reason</th>
                                    <th style="min-width:4rem">
                                        <div class="flex items-center">
                                            Status
                                            <p-columnFilter field="status" matchMode="equals" display="menu">
                                                <ng-template #filter let-values let-filter="filterCallback">
                                                    <p-select [(ngModel)]="filterValue" [options]="appointmentStatuses" (onChange)="filter($event.value)" placeholder="Select One" styleClass="w-full">
                                                        <ng-template let-option #item>
                                                            <p-tag [value]="option.value" [severity]="option.label == 'Scheduled' ? 'info' : option.label == 'Completed' ? 'success' : 'danger'"></p-tag>
                                                        </ng-template>
                                                    </p-select>
                                                </ng-template>
                                            </p-columnFilter>
                                        </div>
                                    </th>
                                    <th style="min-width:8rem">Actions</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-appointment>
                                <tr>
                                    <td class="text-center">
                                        <p-tag [value]="appointment.priority" [severity]="appointment.priority == 'High' ? 'danger' : appointment.priority == 'Medium' ? 'warn' : 'success'"></p-tag>
                                    </td>
                                    <td>
                                        <p-chip class="!py-0 !pl-0 !pr-4 mt-2">
                                            <span class="bg-primary text-primary-contrast rounded-full w-8 h-8 flex items-center justify-center"
                                            style="font-size: xx-small;">
                                                {{ appointment.patientName | nameInitials }}
                                            </span>
                                            <span class="ml-2 font-medium"> {{ appointment.patientName }} </span>
                                        </p-chip>
                                        <div style="margin-left:15px;margin-top:3px" class="flex flex-row">
                                            <div class="flex">
                                                <p-tag [value]="appointment.appointmentType" [severity]="appointment.appointmentType == 'Follow-up' ? 'info' : 'warn'"></p-tag>
                                            </div>
                                            <div class="flex font-semibold text-sm mt-1 ml-2">
                                                <div>
                                                    <div class="text-sm">{{ appointment.patientAge }}</div>
                                                    <div class="text-xs">{{ appointment.patientGender }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-right">
                                        <div>{{ appointment.appointmentDate | date: 'dd MMM yyyy' }}</div>
                                        <div class="text-sm">{{ appointment.appointmentTime }}</div>
                                    </td>
                                    <td>
                                        {{ appointment.department }}
                                    </td>
                                    <td>
                                        {{ appointment.doctor }}
                                    </td>
                                    <td>
                                        {{ appointment.reason }}
                                    </td>
                                    <td>
                                        <p-tag [value]="appointment.status" [severity]="appointment.status == 'Scheduled' ? 'info' : appointment.status == 'Completed' ? 'success' : 'danger'"></p-tag>
                                    </td>
                                    <td>
                                        <div class="flex gap-2">
                                            <button pButton icon="pi pi-dollar" class="p-button-sm p-button-success" 
                                                    title="Payment Check" 
                                                    (click)="openPaymentCheck(appointment)"></button>
                                            <button pButton icon="pi pi-file-edit" class="p-button-sm p-button-info" 
                                                    title="Assessment" 
                                                    (click)="openAssessment(appointment)"></button>
                                        </div>
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template #emptymessage>
                                <tr>
                                    <td colspan="8" class="text-center">No Appointments found.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </p-tabpanel>
                <p-tabpanel value="1">
                    <p-fluid>
                        <div class="flex mt-8">
                            <div class="card flex flex-col gap-6 w-full">
                                <div class="font-semibold text-xl">Create Appointment</div>
                                
                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="patient">Patient</label>
                                        <p-select id="patient" [(ngModel)]="selectedPatient" [options]="patients" optionLabel="name" placeholder="Select Patient" class="w-full"></p-select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="appointmentType">Appointment Type</label>
                                        <p-select id="appointmentType" [(ngModel)]="appointmentType" [options]="appointmentTypes" placeholder="Select Type" class="w-full"></p-select>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="appointmentDate">Appointment Date</label>
                                        <p-calendar inputId="appointmentDate" [(ngModel)]="appointmentDate" [showIcon]="true" dateFormat="mm/dd/yy"></p-calendar>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="appointmentTime">Appointment Time</label>
                                        <p-calendar inputId="appointmentTime" [(ngModel)]="appointmentTime" [timeOnly]="true" hourFormat="12"></p-calendar>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="department">Department</label>
                                        <p-select id="department" [(ngModel)]="department" [options]="departments" placeholder="Select Department" class="w-full"></p-select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="doctor">Doctor</label>
                                        <p-select id="doctor" [(ngModel)]="doctor" [options]="doctors" placeholder="Select Doctor" class="w-full"></p-select>
                                    </div>
                                </div>

                                <div class="flex flex-wrap">
                                    <label for="reason">Reason for Visit</label>
                                    <textarea pTextarea id="reason" rows="4" [(ngModel)]="reason" placeholder="Enter reason for appointment"></textarea>
                                </div>

                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Priority</label>
                                        <div class="flex gap-4">
                                            <div class="flex align-items-center">
                                                <p-radioButton name="priority" value="Low" [(ngModel)]="priority" inputId="low"></p-radioButton>
                                                <label for="low" class="ml-2">Low</label>
                                            </div>
                                            <div class="flex align-items-center">
                                                <p-radioButton name="priority" value="Medium" [(ngModel)]="priority" inputId="medium"></p-radioButton>
                                                <label for="medium" class="ml-2">Medium</label>
                                            </div>
                                            <div class="flex align-items-center">
                                                <p-radioButton name="priority" value="High" [(ngModel)]="priority" inputId="high"></p-radioButton>
                                                <label for="high" class="ml-2">High</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="status">Status</label>
                                        <p-select id="status" [(ngModel)]="status" [options]="appointmentStatuses" placeholder="Select Status" class="w-full"></p-select>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="duration">Duration (minutes)</label>
                                        <input pInputText id="duration" type="number" [(ngModel)]="duration" placeholder="30" />
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="roomNumber">Room Number</label>
                                        <input pInputText id="roomNumber" type="text" [(ngModel)]="roomNumber" placeholder="Room 101" />
                                    </div>
                                </div>

                                <div class="flex flex-wrap">
                                    <label for="notes">Notes (Optional)</label>
                                    <textarea pTextarea id="notes" rows="3" [(ngModel)]="notes" placeholder="Additional notes"></textarea>
                                </div>

                                <div class="flex gap-4 justify-content-between">
                                    <button pButton label="Create Appointment" class="p-button-sm" (click)="createAppointment()" [disabled]="isFormDisabled()"></button>
                                    <button pButton label="Cancel" (click)="cancel()" class="p-button-sm p-button-secondary ml-2"></button>
                                </div>
                            </div>
                        </div>
                    </p-fluid>
                </p-tabpanel>
            </p-tabpanels>
        </p-tabs>

        <!-- Payment Check Dialog -->
        <p-dialog header="Payment Check - {{selectedAppointment?.patientName}}" [(visible)]="showPaymentDialog" [modal]="true" [style]="{width: '50vw'}">
            <div class="flex flex-col gap-4">
                <div class="flex justify-content-between">
                    <span class="font-semibold">Payment Status:</span>
                    <p-tag [value]="paymentStatus" [severity]="paymentStatus == 'Paid' ? 'success' : paymentStatus == 'Partial' ? 'warn' : 'danger'"></p-tag>
                </div>
                <div class="flex justify-content-between">
                    <span>Total Amount:</span>
                    <span class="font-semibold">{{ totalAmount | currency }}</span>
                </div>
                <div class="flex justify-content-between">
                    <span>Paid Amount:</span>
                    <span class="font-semibold">{{ paidAmount | currency }}</span>
                </div>
                <div class="flex justify-content-between">
                    <span>Balance:</span>
                    <span class="font-semibold">{{ (totalAmount - paidAmount) | currency }}</span>
                </div>
                <div class="flex gap-2 mt-4">
                    <button pButton label="Mark as Paid" class="p-button-success p-button-sm" (click)="markAsPaid()"></button>
                    <button pButton label="Checkout" class="p-button-info p-button-sm" (click)="proceedToCheckout()"></button>
                    <button pButton label="Close" class="p-button-secondary p-button-sm" (click)="closePaymentDialog()"></button>
                </div>
            </div>
        </p-dialog>

        <!-- Assessment Dialog -->
        <p-dialog header="Patient Assessment - {{selectedAppointment?.patientName}}" [(visible)]="showAssessmentDialog" [modal]="true" [style]="{width: '90vw', height: '90vh'}" [maximizable]="true">
            <div class="assessment-content" style="height: 70vh; overflow-y: auto;">
                <p-tabs value="0">
                    <p-tablist>
                        <p-tab value="0">Vitals & History</p-tab>
                        <p-tab value="1">Assessment & Plan</p-tab>
                        <p-tab value="2">Medications & Tests</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                        <!-- Vitals & History Tab -->
                        <p-tabpanel value="0">
                            <div class="flex flex-col gap-6 mt-4">
                                <div class="font-semibold text-lg">Vital Signs</div>
                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Blood Pressure (mmHg)</label>
                                        <input pInputText [(ngModel)]="vitals.bloodPressure" placeholder="120/80" />
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Heart Rate (BPM)</label>
                                        <p-inputNumber [(ngModel)]="vitals.heartRate" [min]="0" placeholder="72"></p-inputNumber>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Temperature (°F)</label>
                                        <p-inputNumber [(ngModel)]="vitals.temperature" [minFractionDigits]="1" [maxFractionDigits]="1" placeholder="98.6"></p-inputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Respiratory Rate</label>
                                        <p-inputNumber [(ngModel)]="vitals.respiratoryRate" [min]="0" placeholder="16"></p-inputNumber>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Weight (kg)</label>
                                        <p-inputNumber [(ngModel)]="vitals.weight" [minFractionDigits]="1" [maxFractionDigits]="1" placeholder="70.0"></p-inputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Height (cm)</label>
                                        <p-inputNumber [(ngModel)]="vitals.height" [min]="0" placeholder="170"></p-inputNumber>
                                    </div>
                                </div>

                                <div class="font-semibold text-lg">Past Medical History</div>
                                <div class="flex flex-wrap">
                                    <textarea pTextarea [(ngModel)]="pastMedicalHistory" rows="4" placeholder="Enter patient's past medical history, surgeries, chronic conditions..."></textarea>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Assessment & Plan Tab -->
                        <p-tabpanel value="1">
                            <div class="flex flex-col gap-6 mt-4">
                                <div class="font-semibold text-lg">Doctor's Assessment</div>
                                <div class="flex flex-wrap">
                                    <textarea pTextarea [(ngModel)]="doctorNotes" rows="4" placeholder="Enter clinical assessment, observations, diagnosis..."></textarea>
                                </div>

                                <div class="font-semibold text-lg">ICD Codes</div>
                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Primary ICD Code</label>
                                        <input pInputText [(ngModel)]="icdCodes.primary" placeholder="E11.9" />
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Secondary ICD Codes</label>
                                        <input pInputText [(ngModel)]="icdCodes.secondary" placeholder="I10, Z51.11" />
                                    </div>
                                </div>

                                <div class="font-semibold text-lg">Advice & Recommendations</div>
                                <div class="flex flex-wrap">
                                    <textarea pTextarea [(ngModel)]="advice" rows="4" placeholder="Enter advice for patient, lifestyle modifications, precautions..."></textarea>
                                </div>

                                <div class="font-semibold text-lg">Follow-up Instructions</div>
                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Follow-up Date</label>
                                        <p-calendar [(ngModel)]="followUpDate" [showIcon]="true" dateFormat="mm/dd/yy"></p-calendar>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label>Follow-up Notes</label>
                                        <textarea pTextarea [(ngModel)]="followUpNotes" rows="2" placeholder="Follow-up instructions..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Medications & Tests Tab -->
                        <p-tabpanel value="2">
                            <div class="flex flex-col gap-6 mt-4">
                                <div class="font-semibold text-lg">Medications</div>
                                <div style="max-height: 200px; overflow-y: auto;">
                                    <p-table [value]="medications">
                                        <ng-template pTemplate="header">
                                            <tr>
                                                <th>Medication</th>
                                                <th>Dosage</th>
                                                <th>Frequency</th>
                                                <th>Duration</th>
                                                <th>Action</th>
                                            </tr>
                                        </ng-template>
                                        <ng-template pTemplate="body" let-med let-i="rowIndex">
                                            <tr>
                                                <td><input pInputText [(ngModel)]="med.name" placeholder="Medication name" /></td>
                                                <td><input pInputText [(ngModel)]="med.dosage" placeholder="500mg" /></td>
                                                <td><input pInputText [(ngModel)]="med.frequency" placeholder="Twice daily" /></td>
                                                <td><input pInputText [(ngModel)]="med.duration" placeholder="7 days" /></td>
                                                <td><button pButton icon="pi pi-trash" class="p-button-sm p-button-danger" (click)="removeMedication(i)"></button></td>
                                            </tr>
                                        </ng-template>
                                    </p-table>
                                </div>
                                <button pButton label="Add Medication" icon="pi pi-plus" class="p-button-sm p-button-secondary" (click)="addMedication()"></button>

                                <div class="font-semibold text-lg">Investigations/Tests</div>
                                <div style="max-height: 200px; overflow-y: auto;">
                                    <p-table [value]="investigations">
                                        <ng-template pTemplate="header">
                                            <tr>
                                                <th>Test/Investigation</th>
                                                <th>Urgency</th>
                                                <th>Notes</th>
                                                <th>Action</th>
                                            </tr>
                                        </ng-template>
                                        <ng-template pTemplate="body" let-inv let-i="rowIndex">
                                            <tr>
                                                <td><input pInputText [(ngModel)]="inv.name" placeholder="Blood test, X-Ray, etc." /></td>
                                                <td>
                                                    <p-dropdown [(ngModel)]="inv.urgency" [options]="urgencyOptions" placeholder="Select"></p-dropdown>
                                                </td>
                                                <td><input pInputText [(ngModel)]="inv.notes" placeholder="Special instructions" /></td>
                                                <td><button pButton icon="pi pi-trash" class="p-button-sm p-button-danger" (click)="removeInvestigation(i)"></button></td>
                                            </tr>
                                        </ng-template>
                                    </p-table>
                                </div>
                                <button pButton label="Add Investigation" icon="pi pi-plus" class="p-button-sm p-button-secondary" (click)="addInvestigation()"></button>
                            </div>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>
            <div class="flex gap-2 mt-4 justify-content-end">
                <button pButton label="Save Assessment" class="p-button-success" (click)="saveAssessment()"></button>
                <button pButton label="Print Prescription" class="p-button-info" (click)="printPrescription()"></button>
                <button pButton label="Close" class="p-button-secondary" (click)="closeAssessmentDialog()"></button>
            </div>
        </p-dialog>
    </div>`
})
export class AppointmentCreationComponent implements OnInit {
    public _productService = inject(ProductService);
    public loginService = inject(LoginserviceService);

    statusOptions: any[] = [
        { label: 'All', value: 'all' },
        { label: 'Scheduled', value: 'Scheduled' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];
    
    filterValue: string = 'all';
    appointments: any = [];
    
    appointmentStatuses: any[] = [
        { label: 'Scheduled', value: 'Scheduled' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'No Show', value: 'No Show' }
    ];

    patients: any[] = [
        { name: 'John Doe', value: 'john-doe' },
        { name: 'Jane Smith', value: 'jane-smith' },
        { name: 'Ahmed Khan', value: 'ahmed-khan' }
    ];

    appointmentTypes: string[] = ['Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup'];
    departments: string[] = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'];
    doctors: string[] = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];
    urgencyOptions: any[] = [
        { label: 'Routine', value: 'Routine' },
        { label: 'Urgent', value: 'Urgent' },
        { label: 'STAT', value: 'STAT' }
    ];

    // Form fields
    selectedPatient: any;
    appointmentType: string = '';
    appointmentDate: Date | undefined;
    appointmentTime: Date | undefined;
    department: string = '';
    doctor: string = '';
    reason: string = '';
    priority: string = 'Medium';
    status: string = 'Scheduled';
    duration: number = 30;
    roomNumber: string = '';
    notes: string = '';

    // Dialog states
    showPaymentDialog: boolean = false;
    showAssessmentDialog: boolean = false;
    selectedAppointment: any = null;

    // Payment fields
    paymentStatus: string = 'Unpaid';
    totalAmount: number = 150;
    paidAmount: number = 0;

    // Assessment fields
    vitals: any = {
        bloodPressure: '',
        heartRate: null,
        temperature: null,
        respiratoryRate: null,
        weight: null,
        height: null
    };
    pastMedicalHistory: string = '';
    doctorNotes: string = '';
    icdCodes: any = {
        primary: '',
        secondary: ''
    };
    advice: string = '';
    followUpDate: Date | undefined;
    followUpNotes: string = '';
    medications: any[] = [{ name: '', dosage: '', frequency: '', duration: '' }];
    investigations: any[] = [{ name: '', urgency: '', notes: '' }];

    public filteredAppointments: any;

    createAppointment(): void {
        const newAppointment = {
            patientName: this.selectedPatient?.name || '',
            appointmentDate: this.appointmentDate,
            appointmentTime: this.appointmentTime ? this.appointmentTime.toLocaleTimeString() : '',
            department: this.department,
            doctor: this.doctor,
            reason: this.reason,
            priority: this.priority,
            status: this.status,
            duration: this.duration,
            roomNumber: this.roomNumber,
            notes: this.notes,
            appointmentType: this.appointmentType,
            patientAge: '32 Y 5 M',
            patientGender: 'Male'
        };
        
        this.appointments.push(newAppointment);
        this.filteredAppointments = JSON.stringify(this.appointments);
        alert('Appointment created successfully!');
        this.resetForm();
    }

    // Payment Dialog Methods
    openPaymentCheck(appointment: any): void {
        this.selectedAppointment = appointment;
        this.showPaymentDialog = true;
        // Mock payment data - replace with actual API call
        this.paymentStatus = Math.random() > 0.5 ? 'Paid' : 'Unpaid';
        this.totalAmount = 150;
        this.paidAmount = this.paymentStatus === 'Paid' ? 150 : 0;
    }

    markAsPaid(): void {
        this.paymentStatus = 'Paid';
        this.paidAmount = this.totalAmount;
        alert('Payment marked as paid successfully!');
    }

    proceedToCheckout(): void {
        alert('Redirecting to checkout...');
        // Implement checkout logic here
        this.closePaymentDialog();
    }

    closePaymentDialog(): void {
        this.showPaymentDialog = false;
        this.selectedAppointment = null;
    }

    // Assessment Dialog Methods
    openAssessment(appointment: any): void {
        this.selectedAppointment = appointment;
        this.showAssessmentDialog = true;
        this.resetAssessmentForm();
    }

    addMedication(): void {
        this.medications.push({ name: '', dosage: '', frequency: '', duration: '' });
    }

    removeMedication(index: number): void {
        this.medications.splice(index, 1);
    }

    addInvestigation(): void {
        this.investigations.push({ name: '', urgency: '', notes: '' });
    }

    removeInvestigation(index: number): void {
        this.investigations.splice(index, 1);
    }

    saveAssessment(): void {
        const assessmentData = {
            appointment: this.selectedAppointment,
            vitals: this.vitals,
            pastMedicalHistory: this.pastMedicalHistory,
            doctorNotes: this.doctorNotes,
            icdCodes: this.icdCodes,
            advice: this.advice,
            followUpDate: this.followUpDate,
            followUpNotes: this.followUpNotes,
            medications: this.medications,
            investigations: this.investigations
        };
        
        console.log('Assessment Data:', assessmentData);
        alert('Assessment saved successfully!');
        this.closeAssessmentDialog();
    }

    printPrescription(): void {
        alert('Prescription printed successfully!');
        // Implement print prescription logic
    }

    closeAssessmentDialog(): void {
        this.showAssessmentDialog = false;
        this.selectedAppointment = null;
    }

    resetAssessmentForm(): void {
        this.vitals = {
            bloodPressure: '',
            heartRate: null,
            temperature: null,
            respiratoryRate: null,
            weight: null,
            height: null
        };
        this.pastMedicalHistory = '';
        this.doctorNotes = '';
        this.icdCodes = { primary: '', secondary: '' };
        this.advice = '';
        this.followUpDate = undefined;
        this.followUpNotes = '';
        this.medications = [{ name: '', dosage: '', frequency: '', duration: '' }];
        this.investigations = [{ name: '', urgency: '', notes: '' }];
    }

    cancel() {
        this.resetForm();
    }

    resetForm() {
        this.selectedPatient = null;
        this.appointmentType = '';
        this.appointmentDate = undefined;
        this.appointmentTime = undefined;
        this.department = '';
        this.doctor = '';
        this.reason = '';
        this.priority = 'Medium';
        this.status = 'Scheduled';
        this.duration = 30;
        this.roomNumber = '';
        this.notes = '';
    }

    onGetType() {
        if (this.filterValue === 'all') {
            this.appointments = [...JSON.parse(this.filteredAppointments || '[]')];
        } else {
            let parseAppointments = JSON.parse(this.filteredAppointments || '[]');
            this.appointments = parseAppointments.filter((appointment: any) => appointment.status === this.filterValue);
        }
    }

    isFormDisabled(): boolean {
        return !(
            this.selectedPatient &&
            this.appointmentDate &&
            this.appointmentTime &&
            this.department &&
            this.doctor &&
            this.reason &&
            this.priority &&
            this.status
        );
    }

    async ngOnInit() {
        // Static sample data - replace with your API call
        const sampleAppointments = [
            {
                patientName: 'John Doe',
                appointmentDate: new Date('2024-01-15'),
                appointmentTime: '10:00 AM',
                department: 'Cardiology',
                doctor: 'Dr. Smith',
                reason: 'Regular checkup',
                priority: 'Medium',
                status: 'Scheduled',
                appointmentType: 'Consultation',
                patientAge: '45 Y 2 M',
                patientGender: 'Male'
            },
            {
                patientName: 'Jane Smith',
                appointmentDate: new Date('2024-01-16'),
                appointmentTime: '2:30 PM',
                department: 'Neurology',
                doctor: 'Dr. Johnson',
                reason: 'Follow-up visit',
                priority: 'High',
                status: 'Completed',
                appointmentType: 'Follow-up',
                patientAge: '38 Y 7 M',
                patientGender: 'Female'
            }
        ];
        
        this.appointments = sampleAppointments;
        this.filteredAppointments = JSON.stringify(this.appointments);
    }
}
