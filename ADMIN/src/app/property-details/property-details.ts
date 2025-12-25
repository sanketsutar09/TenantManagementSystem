import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../adminServices/property-service';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';


@Component({
  selector: 'app-property-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css'
})
export class PropertyDetails implements OnInit {
  properties: any[] = [];
  filteredProperties: any[] = [];

  uniqueAddresses: string[] = [];
  uniqueTypes: string[] = [];
  uniqueBHKs: string[] = [];
  uniqueFurnished: string[] = [];

  selectedEmail: string = '';
  uniqueEmails: string[] = [];


  sangliLocations: string[] = [
    'Sangli', 'Miraj', 'Tasgaon', 'Uran Islampur', 'Vita', 'Sangli-Miraj-Kupwad', 'Palus', 'Ashta',
    'Bamani', 'Budhgaon', 'Hingangaon', 'Jat', 'Kadegaon', 'Kavathe-Mahankal', 'Khanapur (Vita)',
    'Kirloskarwadi', 'Kundal', 'Madhavnagar', 'Savlaj', 'Shirala', 'Walwa', 'Wategaon',
    'Atpadi', 'Bhingewadi', 'Bhood', 'Chikhalwadi', 'Devikhindi', 'Dighanchi', 'Kharsundi', 'Shukachari'

  ];

  selectedAddress: string = '';
  selectedType: string = '';
  selectedBHK: string = '';
  selectedFurnished: string = '';
  searchText: string = '';

  minPrice: number | null = null;
  maxPrice: number | null = null;
  minSize: number | null = null;
  maxSize: number | null = null;

  alertMessage: string | null = null;
  alertType: 'success' | 'error' | 'warning' = 'success';

  showImageModal: boolean = false;
  modalImageUrl: string = '';

  veiwDetailModel = false;

  showDetailsModal = false;
  selectedProperty: any = null;
  showAllProperties = false;

  showCardModal = false;
  showPropertyConfirm = false;
  propertyToDelete: string | null = null;

  showUpdateModal = false;
  updateFiles: (File | null)[] = [null, null, null];

  propertyForm!: FormGroup;
  isRoomSelected = false;

  @ViewChildren('fileInput0, fileInput1, fileInput2') fileInputs!: QueryList<any>;

  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      title: ['', Validators.required],
      available: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      bhk: ['', Validators.required],
      size: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', Validators.required],
      furnished: ['', Validators.required]
    });

    this.fetchProperties();
    this.cd.detectChanges();
  }

  fetchProperties(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data.map(prop => ({
          ...prop,
          currentImageIndex: 0

        }));
        this.filteredProperties = [...this.properties];
this.uniqueEmails = [...new Set(data.map(p => p.email))];

        this.uniqueAddresses = [...new Set(data.map(p => p.address))];
        this.uniqueTypes = [...new Set(data.map(p => p.type))];
        this.uniqueBHKs = [...new Set(data.map(p => p.bhk))];
        this.uniqueFurnished = [...new Set(data.map(p => p.furnished))];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching properties:', err)
    });
  }

  // ------------------ Modals ------------------
  openDetailsModal(prop: any): void {
    this.selectedProperty = prop;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.veiwDetailModel = false;
    this.selectedProperty = null;
  }

  openCardModal(prop: any): void {
    this.selectedProperty = { ...prop };
    this.showCardModal = true;
  }

  viewDetailModel(prop: any): void {
    this.selectedProperty = { ...prop };
    this.veiwDetailModel = true;
  }


  closeCardModal(): void {
    this.showCardModal = false;
    this.veiwDetailModel = false;
    this.selectedProperty = null;
  }


  openImageModal(imgUrl: string): void {
    this.modalImageUrl = imgUrl;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.modalImageUrl = '';
  }

  // ------------------ Update Property ------------------
  openUpdateModal(prop: any): void {
    this.selectedProperty = { ...prop }; // clone to avoid mutation
    this.showUpdateModal = true;

    this.propertyForm.patchValue({
      name: prop.name,
      email: prop.email,
      phone: prop.phone,
      title: prop.title,
      description: prop.description,
      type: prop.type,
      bhk: prop.bhk,
      size: prop.size,
      price: prop.price,
      address: prop.address,
      furnished: prop.furnished,
      available: prop.available
    });

    this.isRoomSelected = prop.type === 'Room';
    if (this.isRoomSelected) this.propertyForm.get('bhk')?.disable();
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedProperty = null;
    this.updateFiles = [null, null, null];
    this.propertyForm.reset();
  }

  onFileChange(event: any, index: number): void {
    if (event.target.files && event.target.files.length > 0) {
      this.updateFiles[index] = event.target.files[0];
    }
  }

  onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.isRoomSelected = value === 'Room';
    if (this.isRoomSelected) {
      this.propertyForm.get('bhk')?.disable();
      this.propertyForm.patchValue({ bhk: '' });
    } else {
      this.propertyForm.get('bhk')?.enable();
    }
  }

  submitUpdate(): void {
    if (!this.selectedProperty || this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.entries(this.propertyForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    this.updateFiles.forEach((file, i) => {
      if (file) formData.append(`image${i + 1}`, file);
    });

    this.propertyService.updateProperty(this.selectedProperty._id, formData).subscribe({
      next: (res: any) => {
        const index = this.properties.findIndex(p => p._id === this.selectedProperty._id);
        if (index !== -1) this.properties[index] = res.property;

        this.filteredProperties = [...this.properties];
        this.showAlert('Property updated successfully', 'success');
        this.closeUpdateModal();
        this.cd.detectChanges();
      },
      error: (err) => this.showAlert('Failed to update property', 'error')
    });
    this.cd.detectChanges();
  }

  // ------------------ Filter ------------------
 filterProperties(): void {
  this.filteredProperties = this.properties.filter(prop => {
    const matchesAddress = !this.selectedAddress || prop.address === this.selectedAddress;
    const matchesType = !this.selectedType || prop.type === this.selectedType;
    const matchesBHK = !this.selectedBHK || prop.bhk === this.selectedBHK;
    const matchesFurnished = !this.selectedFurnished || prop.furnished === this.selectedFurnished;
    const matchesEmail = !this.selectedEmail || prop.email === this.selectedEmail;
    const matchesSearch = !this.searchText || prop.address.toLowerCase().includes(this.searchText.toLowerCase());

    const matchesPrice =
      (!this.minPrice || prop.price >= this.minPrice) &&
      (!this.maxPrice || prop.price <= this.maxPrice);

    const matchesSize =
      (!this.minSize || prop.size >= this.minSize) &&
      (!this.maxSize || prop.size <= this.maxSize);

    return (
      matchesAddress &&
      matchesType &&
      matchesBHK &&
      matchesFurnished &&
      matchesEmail &&
      matchesSearch &&
      matchesPrice &&
      matchesSize
    );
  });
}


  // ------------------ Image Carousel ------------------
  nextImage(prop: any): void {
    if (!prop.images || prop.images.length === 0) return;
    prop.currentImageIndex = (prop.currentImageIndex + 1) % prop.images.length;
  }

  prevImage(prop: any): void {
    if (!prop.images || prop.images.length === 0) return;
    prop.currentImageIndex = (prop.currentImageIndex - 1 + prop.images.length) % prop.images.length;
  }

  getImageUrl(filename: string): string {
    return `http://localhost:3000/uploads/${filename}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ------------------ Delete Property ------------------
  openDeletePropertyModal(propertyId: string) {
    this.propertyToDelete = propertyId;
    this.showPropertyConfirm = true;
    this.cd.detectChanges();
  }

  confirmDeleteProperty() {
    if (!this.propertyToDelete) return;

    this.propertyService.deleteProperty(this.propertyToDelete).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p._id !== this.propertyToDelete);
        this.showAlert('Property deleted successfully', 'success');
        this.showPropertyConfirm = false;
        this.propertyToDelete = null;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showAlert('Failed to delete property. Please try again later', 'error');
        this.showPropertyConfirm = false;
        this.propertyToDelete = null;
      }
    });
  }

  closeDeletePropertyModal() {
    this.showPropertyConfirm = false;
    this.propertyToDelete = null;
    this.cd.detectChanges();
  }

  // ------------------ Alerts ------------------
  showAlert(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.alertMessage = message;
    this.alertType = type;
    this.cd.detectChanges();

    setTimeout(() => {
      this.alertMessage = null;
      this.cd.detectChanges();
    }, 3000);
  }

  // inside PropertyDetails class
  generateReport(title: String) {
    const rows = this.filteredProperties.map(prop => `
    <tr>
      <td>${prop.name}</td>
      <td>${prop.email}</td>
      <td>${prop.phone}</td>
      <td>${prop.title}</td>
      <td>${prop.type}</td>
      <td>${prop.bhk || '-'}</td>
      <td>${prop.size} sqft</td>
      <td>₹${prop.price}</td>
      <td>${prop.address}</td>
      <td>${prop.furnished}</td>
      <td>${prop.available > 0 ? prop.available + ' Available' : 'Fully Booked'}</td>
      
    </tr>
  `).join('');

    const table = `
    <table>
      <thead>
        <tr>
          <th>Owner Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Title</th>
          <th>Type</th>
          <th>BHK</th>
          <th>Size</th>
          <th>Price</th>
          <th>Address</th>
          <th>Furnished</th>
          <th>Availability</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

    const appliedFilters = [
  this.searchText ? `<li><strong>Search:</strong> ${this.searchText}</li>` : '',
  this.selectedAddress ? `<li><strong>City:</strong> ${this.selectedAddress}</li>` : '',
  this.selectedType ? `<li><strong>Type:</strong> ${this.selectedType}</li>` : '',
  this.selectedBHK ? `<li><strong>BHK:</strong> ${this.selectedBHK}</li>` : '',
  this.selectedFurnished ? `<li><strong>Furnished:</strong> ${this.selectedFurnished}</li>` : '',
  this.selectedEmail ? `<li><strong>Email:</strong> ${this.selectedEmail}</li>` : '',
  this.minPrice ? `<li><strong>Min Price:</strong> ₹${this.minPrice}</li>` : '',
  this.maxPrice ? `<li><strong>Max Price:</strong> ₹${this.maxPrice}</li>` : '',
  this.minSize ? `<li><strong>Min Size:</strong> ${this.minSize} sqft</li>` : '',
  this.maxSize ? `<li><strong>Max Size:</strong> ${this.maxSize} sqft</li>` : '',
].filter(Boolean).join('');

    const generatedDate = new Date().toLocaleString();

    const newWindow = window.open('', '_blank', 'width=1100,height=700');
    if (!newWindow) return;

    newWindow.document.write(`
    <html>
      <head>
        <title>Property Details Report - DreamHomes</title>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, Tahoma, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f9fafb;
            color: #1f2937;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .company-name {
            font-size: 32px;
            font-weight: 800;
            color: #4f46e5;
            text-transform: uppercase;
          }
          .report-title {
            font-size: 22px;
            color: #111827;
            margin-top: 5px;
            font-weight: 600;
          }
          .generated-date {
            font-size: 14px;
            color: #6b7280;
            margin-top: 4px;
          }

          .filters {
            background: #eef2ff;
            border-left: 5px solid #4f46e5;
            padding: 12px 18px;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          .filters h3 {
            font-size: 17px;
            margin: 0 0 8px 0;
            color: #1e3a8a;
          }
          .filters ul {
            margin: 0;
            padding-left: 18px;
            font-size: 15px;
            color: #374151;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: #fff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            border-radius: 10px;
            overflow: hidden;
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
            font-size: 20px;
          }
          th {
            background: #4f46e5;
            color: #fff;
            text-transform: uppercase;
            font-size: 18px;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          tr:hover {
            background: #eef2ff;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
          }

          .print-btn {
            display: block;
            margin: 35px auto 0 auto;
            background: #16a34a;
            color: #fff;
            border: none;
            padding: 10px 25px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
          }
          .print-btn:hover { background: #15803d; }

          @media print {
            .print-btn { display: none; }
            body { background: #fff; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">DreamHomes</div>
          <div class="report-title">Property Details Report</div>
          <div class="generated-date">Generated on: ${generatedDate}</div>
        </div>

        ${appliedFilters ? `
        <div class="filters">
          <h3>Filters Applied:</h3>
          <ul>${appliedFilters}</ul>
        </div>` : ''}

        ${table}

        <button class="print-btn" onclick="window.print()">🖨 Print Report</button>

        <div class="footer">
          &copy; ${new Date().getFullYear()} DreamHomes. All Rights Reserved.
        </div>
      </body>
    </html>
  `);

    newWindow.document.close();
  }

}
