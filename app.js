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