/*
    Custom react components

*/
import { Icon } from '@iconify/react';

// Page header
export function Header(){
    return (
        <header className="Header">            
            <p className="display-3">
            <Icon icon="dashicons:album" /> <small>Disco</small>Browser
            </p><p className="h4 fw-lighter">Browse Any Spotify Artists' Discography!</p>
        </header>
    )
}

// Page footer
export function Footer() {
    return (
        <footer className="mt-3">
            <p className="h6">
            2023 &copy; <a href="https://www.nkammerer.com/">Nick Kammerer</a></p>
        </footer>
    )
}
