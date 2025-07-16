function addEmployeeRow() {
    const tableBody = document.querySelector("#employeeTable tbody");
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td>${tableBody.rows.length}</td>
        <td><input type="text" placeholder="नाम" required></td>
        <td><input type="text" placeholder="पद" required></td>
        <td><input type="number" class="approved-days" value="15" oninput="updateApprovedAmount(this)"></td>
        <td><input type="number" placeholder="मूल वेतन" oninput="updateApprovedAmount(this)"></td>
        <td><input type="number" placeholder="स्वीकृत राशि" readonly></td>
        <td><input type="number" placeholder="शेष PL"></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeEmployee(this)">Remove</button></td>
    `;
}

function removeEmployee(btn) {
    btn.closest("tr").remove();
    document.querySelectorAll("#employeeTable tbody tr").forEach((row, i) => {
        row.cells[0].textContent = i + 1;
    });
}

function updateApprovedAmount(input) {
    const row = input.closest('tr');
    const basicPay = parseFloat(row.querySelector('input[placeholder="मूल वेतन"]').value) || 0;
    const approvedDays = parseInt(row.querySelector('.approved-days').value) || 0;
    if (basicPay > 0 && approvedDays > 0) {
        const surrenderPay = (basicPay / 30) * approvedDays;
        row.querySelector('input[placeholder="स्वीकृत राशि"]').value = Math.round(surrenderPay);
    } else {
        row.querySelector('input[placeholder="स्वीकृत राशि"]').value = '';
    }
}

function generatePreview() {
    const officeName = document.getElementById("officeName").value;
    const orderNumber = document.getElementById("orderNumber").value;
    const orderDate = document.getElementById("orderDate").value;

    const employees = [];
    document.querySelectorAll("#employeeTable tbody tr").forEach(row => {
        const emp = {
            name: row.querySelector('input[placeholder="नाम"]').value,
            designation: row.querySelector('input[placeholder="पद"]').value,
            approvedDays: row.querySelector('.approved-days').value,
            basicPay: parseFloat(row.querySelector('input[placeholder="मूल वेतन"]').value) || 0,
            approvedAmount: parseFloat(row.querySelector('input[placeholder="स्वीकृत राशि"]').value) || 0,
            remainingPL: row.querySelector('input[placeholder="शेष PL"]').value
        };
        employees.push(emp);
    });

    let previewHtml = `<h2>${officeName}</h2>
                       <p>आदेश संख्या: ${orderNumber}</p>
                       <p>आदेश दिनांक: ${orderDate}</p>
                       <table>
                           <thead>
                               <tr>
                                   <th>क्र.सं.</th>
                                   <th>नाम</th>
                                   <th>पद</th>
                                   <th>स्वीकृत दिन</th>
                                   <th>मूल वेतन</th>
                                   <th>स्वीकृत राशि</th>
                                   <th>शेष PL</th>
                               </tr>
                           </thead>
                           <tbody>`;
    employees.forEach((emp, index) => {
        previewHtml += `<tr>
                            <td>${index + 1}</td>
                            <td>${emp.name}</td>
                            <td>${emp.designation}</td>
                            <td>${emp.approvedDays}</td>
                            <td>${emp.basicPay.toFixed(2)}</td>
                            <td>${emp.approvedAmount.toFixed(0)}</td>
                            <td>${emp.remainingPL}</td>
                        </tr>`;
    });
    previewHtml += `</tbody></table>`;
    document.getElementById("a4Preview").innerHTML = previewHtml;
    document.getElementById("previewSection").style.display = "block";
}

function closePreview() {
    document.getElementById("previewSection").style.display = "none";
}

function resetForm() {
    document.getElementById("officeName").value = "राजकीय उच्च माध्यमिक विद्यालय गोरधनपुरा जिला बाराँ";
    document.getElementById("orderNumber").value = "राऊमावि/2025/1246";
    document.getElementById("orderDate").value = "";
    document.querySelector("#employeeTable tbody").innerHTML = '';
    addEmployeeRow();
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const previewContent = document.getElementById("a4Preview").innerHTML;

    pdf.html(previewContent, {
        callback: function (doc) {
            doc.save('अवकाश_सरेंडर_आदेश.pdf');
        },
        x: 10,
        y: 10
    });
}
