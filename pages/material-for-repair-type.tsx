import Head from 'next/head'
import useSWR from 'swr'
import Table from '../components/Table'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop';

function MaterialForRepairs() {

    const fetcher = url => fetch(url).then(r => r.json())

    // Retrieve the table requested by the parent component
    const { data, error } = useSWR<object[], Error>('/api/materialforrepairtype/readable', fetcher)
    if (error) console.log(error)
    if (!data) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress />
            </Backdrop>
        )
    }
    
    if (data[0] == undefined) return <div className="mt-16">There is no data in this table</div>

    // Used for creating unique html keys in the table cells
    let cellKey = 0
    let rowKey = 0

    return (
        <div>
            <Head>
                <title>Material For Repair Types</title>
                <meta name="description" content="Manage Material For Repair Types" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
                    Material For Repair Types
                </div>
                <div className="mx-auto">
                    <div className="table border-collapse table-auto text-sm mt-16 mb-32">
                        <div className="table-header-group">
                                <div className="table-row">
                                        <div key="Repair Type Name" className="table-cell border-b border-slate-600 font-medium p-4 pl-8 pt-0 pb-2 text-left capitalize">Repair Type Name</div>
                                        <div key="Material Name" className="table-cell border-b border-slate-600 font-medium p-4 pl-8 pt-0 pb-2 text-left capitalize">Material Name</div>
                                </div>
                        </div>
                        <div className="table-row-group">
                            {data.map(pair => (
                                <div key={(rowKey += 1).toString()} className="table-row">
                                    {Object.values(pair)
                                        .map(cell => (
                                            <div key={(cellKey += 1).toString()} className="table-cell border-b border-slate-600 font-medium p-4 pl-8 pt-2 pb-2 text-left">{cell}</div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaterialForRepairs