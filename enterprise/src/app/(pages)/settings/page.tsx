'use client'
import { SetStateAction, useState} from 'react';
import ProfileTab from '@/components/page/profile'
import About from '@/components/page/about'
import Policy from "@/components/page/policy";
import Support from "@/components/page/support";


const tabs = [
    {id: 'profile', label: 'Profile', content: ProfileTab},
    { id: 'about', label: 'About',content: About },
    { id: 'policy', label: 'Policy', content: Policy},
    { id: 'support', label: 'Support', content: Support },


];



export default function Profile() {
    const [activeTab, setActiveTab] = useState(tabs[0].id); // State to manage active tab

    const handleTabChange = (tabId: SetStateAction<string>) => {
        setActiveTab(tabId);
    };

    const TabComponent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div className="w-[70vw] flex min-h-screen w-full flex-col mx-auto mt-5">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10  bg-white">
                <div>
                    <h2 className={`font-bold text-3xl mb-5`}>Setting</h2>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav className="grid gap-4 text-sm text-muted-foreground  ">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`font-semibold text-primary ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'} flex flex-col py-4 text-lg`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                    <div className="grid gap-6">
                        {TabComponent && <TabComponent />}
                    </div>
                </div>
            </main>
        </div>
    );
}
