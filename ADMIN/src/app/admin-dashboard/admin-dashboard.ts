import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../adminServices/admin-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  // Full data structure based on backend response
  data: {
    users: any[];
    properties: any[];
    deletedProperties: any[];
    bookings: any[];
    cancelledBookings: any[];
    feedbacks: any[];
  } = {
      users: [], properties: [], deletedProperties: [], bookings: [], cancelledBookings: [], feedbacks: []
    };

  // Filtered arrays
  filteredUsers: any[] = [];
  filteredProperties: any[] = [];
  filteredDeletedProperties: any[] = [];
  filteredBookings: any[] = [];
  filteredCancelledProperties: any[] = [];
  filteredFeedbacks: any[] = [];

 // Visible counts for pagination
  visibleUsers: number = 3;
  visibleProperties: number = 3;
  visibleDeletedProperties: number = 3;
  visibleBookings: number = 3;
  visibleCancelledProperties: number = 3;
  visibleFeedbacks: number = 3;

  // Search filter
  filterEmail: string = '';

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.adminService.getAllData('').subscribe({
      next: (res) => {
        this.data = res;
        // initialize filtered lists
        this.filteredUsers = [...this.data.users];
        this.filteredProperties = [...this.data.properties];
        this.filteredDeletedProperties = [...this.data.deletedProperties];
        this.filteredBookings = [...this.data.bookings];
        this.filteredCancelledProperties = [...this.data.cancelledBookings];
        this.filteredFeedbacks = [...this.data.feedbacks];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching admin data:', err);
      }
    });
  }

  onRefresh() {
  this.filterEmail = "";   // clear input
  this.onSearchChange();   // reload full data
}

  onSearchChange(): void {
    const search = this.filterEmail.toLowerCase().trim();

    this.filteredUsers = this.data.users.filter(user =>
      !search || (user.email && user.email.toLowerCase().includes(search))
    );

    this.filteredProperties = this.data.properties.filter(p =>
      !search || (p.email && p.email.toLowerCase().includes(search))
    );

    this.filteredDeletedProperties = this.data.deletedProperties.filter(dp =>
      !search || (dp.email && dp.email.toLowerCase().includes(search))
    );

    this.filteredBookings = this.data.bookings.filter(b =>
      !search || (b.email && b.email.toLowerCase().includes(search))
    );

   this.filteredCancelledProperties = this.data.cancelledBookings.filter(cb =>
  !search || (cb.userEmail && cb.userEmail.toLowerCase().includes(search))
);

this.filteredFeedbacks = this.data.feedbacks.filter(f =>
  !search || (f.email && f.email.toLowerCase().includes(search))
);


    this.cd.detectChanges();
  }

  // Toggle show more/less
  toggleShow(section: string, total: number) {
    switch (section) {
      case 'users':
        this.visibleUsers = this.visibleUsers >= total ? 3 : this.visibleUsers + 12;
        break;
      case 'properties':
        this.visibleProperties = this.visibleProperties >= total ? 3 : this.visibleProperties + 6;
        break;
      case 'deleted':
        this.visibleDeletedProperties = this.visibleDeletedProperties >= total ? 3 : this.visibleDeletedProperties + 6;
        break;
      case 'bookings':
        this.visibleBookings = this.visibleBookings >= total ? 3 : this.visibleBookings + 6;
        break;
      case 'cancelled':
        this.visibleCancelledProperties = this.visibleCancelledProperties >= total ? 3 : this.visibleCancelledProperties + 6;
        break;
      case 'feedbacks':
        this.visibleFeedbacks = this.visibleFeedbacks >= total ? 3 : this.visibleFeedbacks + 6;
        break;
    }
  }

generateFullReport() {
  const sections = [
    { 
      title: 'Users',
      rows: this.filteredUsers,
      headers: ['Name', 'Email', 'Login Count'],
      fields: ['name', 'email', 'loginCount']
    },
    { 
      title: 'Properties',
      rows: this.filteredProperties,
      headers: ['Title', 'Type', 'BHK', 'Price', 'Address', 'Size', 'Status', 'Furnishing'],
      fields: ['title', 'type', 'bhk', 'price', 'address', 'size', 'status', 'furnished']
    },
    { 
      title: 'Deleted Properties',
      rows: this.filteredDeletedProperties,
      headers: ['Title', 'Email', 'Price'],
      fields: ['title', 'email', 'price']
    },
    { 
      title: 'Bookings',
      rows: this.filteredBookings,
      headers: ['Title', 'Name', 'Email','Phone no', 'Owner name', 'Owner Email',  'Price','Type',],
      fields: ['title', 'name', 'email','phone', 'ownerName','ownerEmail', 'price','type',]
    },
    { 
      title: 'Cancelled Bookings',
      rows: this.filteredCancelledProperties,
      headers: ['Title', 'User Name', 'User Email'],
      fields: ['title', 'userName', 'userEmail']
    },
    { 
      title: 'Feedback',
      rows: this.filteredFeedbacks,
      headers: ['Name', 'Email', 'Feedback'],
      fields: ['name', 'email', 'feedback']
    },
  ];

  let content = ``;

  sections.forEach(sec => {
    if (sec.rows.length > 0) {
      content += `
        <div class="section">
          <h3>${sec.title}</h3>
          <table>
            <thead>
              <tr>${sec.headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${sec.rows.map((row: any) => `
                <tr>${sec.fields.map(f => `<td>${row[f] ?? ''}</td>`).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  });

  const generatedDate = new Date().toLocaleString();

  const reportInfo = `
    <div class="filters">
      <h3>Report Summary</h3>
      <ul>
        <li><strong>Report Type:</strong> Full Admin Dashboard Overview</li>
        ${this.filterEmail ? `<li><strong>Filtered By Email:</strong> ${this.filterEmail}</li>` : ''}
        <li><strong>Generated On:</strong> ${generatedDate}</li>
      </ul>
    </div>
  `;

  const newWindow = window.open('', '_blank', 'width=1100,height=750');
  if (!newWindow) return;

  newWindow.document.write(`
    <html>
      <head>
        <title>Admin Dashboard Report - DreamHomes</title>
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
          .report-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-top: 4px;
          }

          /* Filters / Summary */
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
            font-size: 18px;
            margin-bottom: 4px;
          }

          /* Sections */
          .section {
            margin-bottom: 40px;
          }
          .section h3 {
            color: #4f46e5;
            margin-bottom: 10px;
            border-left: 4px solid #4f46e5;
            padding-left: 10px;
            font-size: 18px;
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
          <div class="report-title">Admin Dashboard - Full Report</div>
          <div class="report-subtitle">Comprehensive overview of all sections</div>
        </div>

        ${reportInfo}

        ${content}

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
