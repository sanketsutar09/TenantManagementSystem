import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminService } from '../adminServices/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails {
// Full data structure based on backend response
  data: { users: any[];} = { users: [] };

  // Filtered arrays
  filteredUsers: any[] = [];

 // Pagination control
  visibleUsers: any[] = [];
  visibleCount: number = 15;
  showMoreVisible: boolean = false;
  showLessVisible: boolean = false;

  // Search filter
  filterEmail: string = '';
  fromDate: string = '';
toDate: string = '';


  showCreateUserModal: boolean = false;
  newUser = {
    name: '',
    email: '',
    password: ''
  };
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
         this.updateVisibleUsers();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching admin data:', err);
      }
    });
  }

  onRefresh() {
  this.filterEmail = '';
  this.fromDate = '';
  this.toDate = '';
  this.onSearchChange();
}


 onSearchChange(): void {
  const search = this.filterEmail.toLowerCase().trim();

  this.filteredUsers = this.data.users.filter(user => {
    const matchesEmail =
      !search || (user.email && user.email.toLowerCase().includes(search));

    const userDate = new Date(user.createdAt);
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    const matchesDate =
      (!from || userDate >= from) &&
      (!to || userDate <= new Date(to.setHours(23, 59, 59, 999)));

    return matchesEmail && matchesDate;
  });

  this.updateVisibleUsers();
  this.cd.detectChanges();
}


   updateVisibleUsers() {
    this.visibleUsers = this.filteredUsers.slice(0, this.visibleCount);
    this.showMoreVisible = this.filteredUsers.length > this.visibleCount;
    this.showLessVisible =
      this.filteredUsers.length > 15 && this.visibleCount >= this.filteredUsers.length;
  }

   showMore() {
    this.visibleCount += 5;
    this.updateVisibleUsers();
  }

  showLess() {
    this.visibleCount = 15;
    this.updateVisibleUsers();
  }

  openCreateUserModal() {
    this.showCreateUserModal = true;
  }

  closeCreateUserModal() {
    this.showCreateUserModal = false;
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) return;

    this.adminService.createUser(this.newUser).subscribe({
      next: (res) => {
        alert(res.message);
        this.closeCreateUserModal();
        this.fetchData(); // refresh user list
      },
      error: (err) => {
        console.error(err);
        alert(err.error.message || "Error creating user");
      }
    });
  }

generateReport(title: string, tableId: string, filters?: Record<string, string>) {
  const table = document.getElementById(tableId)?.outerHTML;
  if (!table) return;

  const websiteName = "DreamHomes";
  const generatedDate = new Date().toLocaleString();

  let filterHTML = '';
  if (filters && Object.keys(filters).length > 0) {
    filterHTML = `
      <div class="filters">
        <h3>Report Filters</h3>
        <ul>
          ${Object.entries(filters)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('')}
        </ul>
      </div>
    `;
  }

  const newWindow = window.open('', '_blank', 'width=1200,height=800');
  if (!newWindow) return;

  newWindow.document.write(`
    <html>
      <head>
        <title>${title} Report - ${websiteName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f8fafc;
            color: #1f2937;
          }
          h1, h2, h3, p { margin: 0; padding: 0; }

          /* Header */
          .report-header {
            text-align: center;
            border-bottom: 4px solid #4f46e5;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          .website-name {
            font-size: 32px;
            font-weight: 800;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .report-title {
            font-size: 22px;
            margin-top: 8px;
            color: #111827;
            font-weight: 600;
          }
          .generated-date {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
          }

          /* Filters section */
          .filters {
            margin-top: 20px;
            margin-bottom: 25px;
            background: #eef2ff;
            border-left: 5px solid #4f46e5;
            padding: 15px 20px;
            border-radius: 8px;
          }
          .filters h3 {
            font-size: 18px;
            margin-bottom: 10px;
            color: #1e3a8a;
          }
          .filters ul {
            list-style-type: none;
            padding-left: 0;
          }
          .filters li {
            font-size: 15px;
            margin-bottom: 5px;
          }

          /* Table */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background: #4f46e5;
            color: #fff;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 18px;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          tr:hover {
            background: #e0e7ff;
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

          @media print {
            .print-btn { display: none; }
            body { background: #fff; }
            table { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="website-name">${websiteName}</div>
          <div class="report-title">${title}</div>
          <div class="generated-date">Generated on: ${generatedDate}</div>
        </div>

        ${filterHTML}

        ${table}

        <button class="print-btn" onclick="window.print()">🖨 Print Report</button>

        <div class="report-footer">
          &copy; ${new Date().getFullYear()} ${websiteName}. All rights reserved.
        </div>
      </body>
    </html>
  `);

  newWindow.document.close();
}


}
