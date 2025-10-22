
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-4 px-4 md:px-8 border-b border-gray-700/50">
            <div className="container mx-auto">
                <h1 className="text-2xl font-black tracking-tighter text-white">
                    Image Animator <span className="text-purple-400">Pro</span>
                </h1>
                <p className="text-sm text-gray-400">Create & Export Custom Animations</p>
            </div>
        </header>
    );
};

export default Header;
