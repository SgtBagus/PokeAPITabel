import Badge from "../../../Components/Badge";

export const STATUS_LIST = [
    {
        value: true,
        option: 'Selesai',
    },
    {
        value: false,
        option: 'Belum Selesai',
    },
]

export const TABEL_META = [
    {
        title: 'Judul',
        key: 'title',
    },
    {
        title: 'Kegiatan',
        key: 'task',
    },
    {
        title: 'Status',
        key: 'statusFinish',
        Cell: (val) => {
            return val ? <Badge className="badge bg-primary" label="Selesai" /> : <Badge className="badge bg-danger" label="Belum Selesai" />
        }
    },
    {
        title: 'Urutan',
        key: 'orderNumber',
    },
];
