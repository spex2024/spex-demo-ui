import Header from "../../../components/main/header";



export default function Layout({ children }) {
    return (
        <>


             <Header/>
            <main>{children}</main>
        </>

    )
}