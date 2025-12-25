import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Booking, BookingService } from '../adminServices/booking-service';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../adminServices/admin-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-details',
  imports: [CommonModule,FormsModule],
  providers: [DatePipe],
  templateUrl: './booking-details.html',
  styleUrl: './booking-details.css'
})
export class BookingDetails implements OnInit {


  // Full data structure based on backend response
  data: {
    bookings: any[];
  } = { bookings: [] };

  // Filtered arrays
  filteredBookings: any[] = [];

  // Search filter
  filterEmail: string = '';
  filterOwnerEmail: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';

  activeFilterLabel: string = '';


  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.adminService.getAllData('').subscribe({
      next: (res) => {

        res.bookings.forEach((b: any) => {
          //Store date for filtering
          b.checkInRaw = this.datePipe.transform(b.checkInDate, 'yyyy-MM-dd');
          b.bookedAtRaw = this.datePipe.transform(b.createdAt, 'yyyy-MM-dd');
          b.dobRaw = this.datePipe.transform(b.dob, 'yyyy-MM-dd');

          //store display format for table
          b.checkInDate = this.datePipe.transform(b.checkInDate, 'dd-MM-yyyy');
          b.createdAt = this.datePipe.transform(b.createdAt, 'dd-MM-yyyy');
          b.dob = this.datePipe.transform(b.dob, 'dd-MM-yyyy');

        }); 
        this.data = res;
        // initialize filtered lists

        this.filteredBookings = [...this.data.bookings];

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching admin data:', err);
      }
    });
  }

  onRefresh() {
  this.filterEmail = '';
  this.filterOwnerEmail = '';
  this.filterFromDate = '';
  this.filterToDate = '';
  this.activeFilterLabel = '';
  this.filteredBookings = [...this.data.bookings];
  this.cd.detectChanges();
}

 onSearchChange(): void {
  const searchUserEmail = this.filterEmail.toLowerCase().trim();
  const searchOwnerEmail = this.filterOwnerEmail.toLowerCase().trim();

  let results = [...this.data.bookings];
  let filters: string[] = [];

  // 🔹 User Email filter
  if (searchUserEmail) {
    results = results.filter(b =>
      b.email && b.email.toLowerCase().includes(searchUserEmail)
    );
    filters.push(`User Email: "${this.filterEmail}"`);
  }

  // 🔹 Owner Email filter
  if (searchOwnerEmail) {
    results = results.filter(b =>
      b.ownerEmail && b.ownerEmail.toLowerCase().includes(searchOwnerEmail)
    );
    filters.push(`Owner Email: "${this.filterOwnerEmail}"`);
  }

  // 🔹 Booked From Date
  if (this.filterFromDate) {
    results = results.filter(b =>
      b.bookedAtRaw && b.bookedAtRaw >= this.filterFromDate
    );
    filters.push(`Booked From: ${this.filterFromDate}`);
  }

  // 🔹 Booked To Date
  if (this.filterToDate) {
    results = results.filter(b =>
      b.bookedAtRaw && b.bookedAtRaw <= this.filterToDate
    );
    filters.push(`Booked To: ${this.filterToDate}`);
  }

  this.filteredBookings = results;
  this.activeFilterLabel = filters.length ? filters.join(' | ') : '';
  this.cd.detectChanges();
}



generateReport(title: string, section: string) {
  // Build table rows dynamically
  const rows = this.filteredBookings.map((b, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${b.title}</td>
      <td>${b.type}</td>
      <td>${b.bhk}</td>
      <td>${b.address}</td>
      <td>₹${b.price}</td>
      <td>${b.furnished}</td>
      <td>${b.ownerName}</td>
      <td>${b.ownerEmail}</td>
      <td>${b.name}</td>
      <td>${b.email}</td>
      <td>${b.phone}</td>
      <td>${b.emergencyPhone}</td>
      <td>${b.dob}</td>
      <td>${b.govIdType}</td>
      <td>${b.govIdNumber}</td>
      <td>${b.createdAt}</td>
    </tr>
  `).join('');

  const table = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Property</th>
          <th>Type</th>
          <th>BHK</th>
          <th>Address</th>
          <th>Price</th>
          <th>Furnished</th>
          <th>Owner</th>
          <th>Owner Email</th>
          <th>Tenant</th>
          <th>Tenant Email</th>
          <th>Phone</th>
          <th>Emergency</th>
          <th>DOB</th>
          <th>ID Type</th>
          <th>ID Number</th>
          <th>Booked On</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  const generatedDate = new Date().toLocaleString();

  // Report details / filters info
  const reportFilters = `
    <div class="filters">
      <h3>Report Details</h3>
      <ul>
        <li><strong>Section:</strong> ${section}</li>
        ${this.activeFilterLabel ? `<li><strong>Filter:</strong> ${this.activeFilterLabel}</li>` : ''}
        <li><strong>Generated On:</strong> ${generatedDate}</li>
      </ul>
    </div>
  `;

  const newWindow = window.open('', '_blank', 'width=1100,height=750');
  if (!newWindow) return;

  newWindow.document.write(`
    <html>
      <head>
        <title>${title} Report - DreamHomes</title>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, Tahoma, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f8fafc;
            color: #1f2937;
          }

          /* Header */
          .report-header {
            text-align: center;
            border-bottom: 4px solid #4f46e5;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 32px;
            font-weight: 800;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .report-title {
            font-size: 22px;
            font-weight: 600;
            color: #111827;
            margin-top: 8px;
          }
          .section-name {
            font-size: 16px;
            color: #6b7280;
            margin-top: 4px;
          }

          /* Filters info */
          .filters {
            background: #eef2ff;
            border-left: 5px solid #4f46e5;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          .filters h3 {
            margin: 0 0 8px 0;
            color: #1e3a8a;
            font-size: 18px;
          }
          .filters ul {
            list-style-type: none;
            margin: 0;
            padding-left: 0;
          }
          .filters li {
            font-size: 15px;
            margin-bottom: 4px;
          }

          /* Table */
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
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
            font-weight: 600;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          tr:hover {
            background: #e0e7ff;
          }

          /* Print Button */
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
          .print-btn:hover {
            background: #15803d;
          }

          /* Footer */
          .report-footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
          }

          /* Print media */
          @media print {
            .print-btn { display: none; }
            body { background: #fff; }
            table { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="company-name">DreamHomes</div>
          <div class="report-title">${title} Report</div>
          <div class="section-name">Section: ${section}</div>
        </div>

        ${reportFilters}

        ${table}

        <button class="print-btn" onclick="window.print()">🖨 Print Report</button>

        <div class="report-footer">
          &copy; ${new Date().getFullYear()} DreamHomes. All Rights Reserved.
        </div>
      </body>
    </html>
  `);

  newWindow.document.close();
}

}