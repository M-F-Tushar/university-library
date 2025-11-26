import {
    BookOpenIcon,
    AcademicCapIcon,
    Squares2X2Icon,
    CalendarIcon,
    GlobeAltIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export interface NavigationItem {
    name: string;
    href: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export const mainNavigation: NavigationItem[] = [
    {
        name: 'Browse',
        href: '/resources',
        icon: BookOpenIcon,
    },
    {
        name: 'Courses',
        href: '/courses',
        icon: AcademicCapIcon,
    },
    {
        name: 'Categories',
        href: '/categories',
        icon: Squares2X2Icon,
    },
    {
        name: 'Semesters',
        href: '/semesters',
        icon: CalendarIcon,
    },
    {
        name: 'External Resources',
        href: '/external-resources',
        icon: GlobeAltIcon,
    },
    {
        name: 'About',
        href: '/about',
        icon: InformationCircleIcon,
    },
];
