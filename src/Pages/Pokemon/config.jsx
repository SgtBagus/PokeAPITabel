const titleCase = (str) => {
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

export const TABEL_META = [
    {
        key: 'no',
        title: 'Nomor',
    },
    {
        key: 'no',
        title: 'image',
        Cell: (val) => (<img alt="gambar pokemonnya !" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${val}.png`} />)
    },
    {
        key: 'name',
        title: 'Nama',
        Cell: (val) => titleCase(val),
    },
];
