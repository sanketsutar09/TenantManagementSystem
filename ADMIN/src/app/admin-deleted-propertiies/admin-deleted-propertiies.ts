import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../adminServices/admin-service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-deleted-propertiies',
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './admin-deleted-propertiies.html',
  styleUrl: './admin-deleted-propertiies.css'
})
export class AdminDeletedPropertiies implements OnInit {

  // Full data structure based on backend response
  data: {
    deletedProperties: any[];
  } = {
    deletedProperties: []
  };

  // Filtered arrays
  filteredDeletedProperties: any[] = [];

  // Filters
  filterEmail: string = '';
  filterCreatedFromDate: string = '';
  filterCreatedToDate: string = '';
  filterDeletedFromDate: string = '';
  filterDeletedToDate: string = '';

  // Active filter label
  activeFilterLabel: string = '';

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  // Fetch data from backend
  fetchData(): void {
    this.adminService.getAllData('').subscribe({
      next: (res) => {
        res.deletedProperties.forEach((db: any) => {
          // store raw formats for filtering
          db.deletedDateRaw = this.datePipe.transform(db.deletedOn, 'yyyy-MM-dd');
          db.createdDateRaw = this.datePipe.transform(db.createdOn, 'yyyy-MM-dd');

          // display formats for table
          db.deletedOn = this.datePipe.transform(db.deletedOn, 'dd-MM-yyyy');
          db.createdOn = this.datePipe.transform(db.createdOn, 'dd-MM-yyyy');
        });

        this.data = res;
        this.filteredDeletedProperties = [...this.data.deletedProperties];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching admin data:', err);
      }
    });
  }

  // Reset filters
  onRefresh() {
    this.filterEmail = '';
    this.filterCreatedFromDate = '';
    this.filterCreatedToDate = '';
    this.filterDeletedFromDate = '';
    this.filterDeletedToDate = '';
    this.activeFilterLabel = '';
    this.filteredDeletedProperties = [...this.data.deletedProperties];
    this.cd.detectChanges();
  }

  // Apply filters
  onSearchChange(): void {
    const search = this.filterEmail.toLowerCase().trim();
    let results = [...this.data.deletedProperties];
    let filters: string[] = [];

    // Email filter
    if (search) {
      results = results.filter(cb =>
        cb.email && cb.email.toLowerCase().includes(search)
      );
      filters.push(`Email: "${this.filterEmail}"`);
    }

    // Created Date filter
    if (this.filterCreatedFromDate) {
      results = results.filter(db => db.createdDateRaw && db.createdDateRaw >= this.filterCreatedFromDate);
      filters.push(`Created From: ${this.filterCreatedFromDate}`);
    }
    if (this.filterCreatedToDate) {
      results = results.filter(db => db.createdDateRaw && db.createdDateRaw <= this.filterCreatedToDate);
      filters.push(`Created To: ${this.filterCreatedToDate}`);
    }

    // Deleted Date filter
    if (this.filterDeletedFromDate) {
      results = results.filter(db => db.deletedDateRaw && db.deletedDateRaw >= this.filterDeletedFromDate);
      filters.push(`Deleted From: ${this.filterDeletedFromDate}`);
    }
    if (this.filterDeletedToDate) {
      results = results.filter(db => db.deletedDateRaw && db.deletedDateRaw <= this.filterDeletedToDate);
      filters.push(`Deleted To: ${this.filterDeletedToDate}`);
    }

    this.filteredDeletedProperties = results;
    this.activeFilterLabel = filters.length ? filters.join(' | ') : '';
    this.cd.detectChanges();
  }
  
  // Generate section report
generateReport(title: string, section: string) {
  // Build table rows dynamically
  const rows = this.filteredDeletedProperties.map(dp => `
    <tr>
      <td>${dp.title}</td>
      <td>${dp.name} (${dp.email})</td>
      <td>${dp.bhk}</td>
      <td>${dp.size} sq.ft</td>
      <td>₹${dp.price}</td>
      <td>${dp.address}</td>
      <td>${dp.createdOn}</td>
      <td>${dp.deletedOn}</td>
    </tr>
  `).join('');

  const table = `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Owner</th>
          <th>BHK</th>
          <th>Size</th>
          <th>Price</th>
          <th>Address</th>
          <th>Created On</th>
          <th>Deleted On</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  const generatedDate = new Date().toLocaleString();

  // Filters or section info
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

  // Open report in new tab
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
