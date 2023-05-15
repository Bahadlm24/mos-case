const axiosInstance = axios.create();
const mock = new AxiosMockAdapter(axiosInstance);

let machines = [
    { machineID: 1, machineName: 'Machine 1', machineDescription: 'Machine 1 description', machineParentGroupID: 0 },
    { machineID: 2, machineName: 'Machine 2', machineDescription: 'Machine 2 description', machineParentGroupID: 1 }
];

//Machine Page

mock.onGet('/api/machines').reply(200, machines);
mock.onPost('/api/machines').reply(config => {
    const machine = JSON.parse(config.data);
    machine.machineID = machines.length + 1;
    machines.push(machine);
    return [200, machine];
});

mock.onPut(/\/api\/machines\/\d+/).reply(config => {
    const updatedMachine = JSON.parse(config.data);
    const machine = machines.find(m => m.machineID == updatedMachine.machineID);
    if (machine) {
        machine.machineName = updatedMachine.machineName;
        machine.machineDescription = updatedMachine.machineDescription;
        machine.machineParentGroupID = updatedMachine.machineParentGroupID;
        return [200, machine];
    } else {
        return [404];
    }
});

mock.onDelete(/\/api\/machines\/\d+/).reply(config => {
    const id = parseInt(config.url.split('/').pop());
    const index = machines.findIndex(m => m.machineID == id);
    if (index > -1) {
        machines.splice(index, 1);
        return [204];
    } else {
        return [404];
    }
});
const machineParentGroupSelect = document.getElementById('machineParentGroupID');
document.getElementById('addMachineButton').addEventListener('click', () => {
    document.getElementById('machineForm').reset();
    document.getElementById('machineID').value = null;
    document.getElementById('machineForm').style.display = 'block';
});

document.getElementById('machineForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const machineID = document.getElementById('machineID').value;
    const machineName = document.getElementById('machineName').value;
    const machineDescription = document.getElementById('machineDescription').value;
    const machineParentGroupID = document.getElementById('machineParentGroupID').value;
    if(machineID) {
        axiosInstance.put(`/api/machines/${machineID}`, {
            machineID,
            machineName,
            machineDescription,
            machineParentGroupID
        }).then(loadMachines);
    } else {
        axiosInstance.post('/api/machines', {
            machineName,
            machineDescription,
            machineParentGroupID
        }).then(loadMachines);
    }
});

function loadMachines() {
    axiosInstance.get('/api/machines').then((response) => {
        const machinesTable = document.getElementById('machinesTable');
        machinesTable.innerHTML = '';
        machineParentGroupSelect.innerHTML = ''; // Temizleme işlemi
        let emptyOption = document.createElement('option');
        emptyOption.value = ''; // Boş değer
        emptyOption.textContent = 'No Parent Group'; // Boş seçenek metni
        machineParentGroupSelect.appendChild(emptyOption);
        for (let machine of response.data) {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${machine.machineID}</td>
                <td>${machine.machineName}</td>
                <td>${machine.machineDescription}</td>
                <td>${getParentObjectName(machine.machineParentGroupID)}</td>
                <td>
                    <button class="btn btn-primary" onclick="editMachine(${machine.machineID})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteMachine(${machine.machineID})">Delete</button>
                </td>
            `;
            machinesTable.appendChild(row);

            // Makine Parent Group ID dropdownunu güncelleme
            let option = document.createElement('option');
            option.value = machine.machineID;
            option.textContent = machine.machineName;
            machineParentGroupSelect.appendChild(option);
        }
    });
}

function getParentObjectName(parentID) {
    if (parentID === 0) {
        return 'No Parent';
    } else {
        const parentMachine = machines.find(machine => machine.machineID === parentID);
        return parentMachine ? parentMachine.machineName : 'Unknown';
    }
}

function editMachine(id) {
    const machine = machines.find(m => m.machineID == id);
    document.getElementById('machineID').value = machine.machineID;
    document.getElementById('machineName').value = machine.machineName;
    document.getElementById('machineDescription').value = machine.machineDescription;
    document.getElementById('machineParentGroupID').value = machine.machineParentGroupID;
    document.getElementById('machineForm').style.display = 'block';
}

function deleteMachine(id) {
    axiosInstance.delete(`/api/machines/${id}`).then(loadMachines);
}

const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const contentSections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

function showSection(sectionId) {
    contentSections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

loadMachines();
showSection("machinesSection")

//Machines page

// Products page