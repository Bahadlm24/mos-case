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