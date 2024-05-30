import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { any } from "zod";


function classNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

interface ListProps {
    name: string
}

interface MenuProps {
    className_menu?: string,
    className_buttom: string,
    className_items: string,
    content: () => JSX.Element,
    additional_content?: JSX.Element,
    list: ListProps[],
    callback: (index: number) => void,
}

// const Data_Branch = {
//     className_buttom: 'inline-flex mr-4 items-center h-7 w-40 rounded-md bg-white px-3 py-2 text-sm font-light text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
//     className_items: 'mt-2 origin-top-right',
//     content: () => 'boton',
//     additional_content: 'hoa',
//     list: [],
//     callback: (index: number) => void,
// }

export default function Drop({ ...props }: MenuProps) {
    return (
        <Menu as="div" className={`${props.className_menu}`} >
            <Menu.Button className={`${props.className_buttom}`}>
                {props.content}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className={`absolute right-0 z-10 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${props.className_items}`}>
                    <ul className="py-1">
                        {props.additional_content}
                        {props.list.map((element, index) => (
                            < MenuItems key={index} index={index} name={element.name} callback={props.callback} />
                        ))}
                    </ul>
                </Menu.Items>
            </Transition>
        </Menu >

    )
}

interface MenuItemProps {
    name: string,
    index: number,
    callback: (index: number) => void,
}


function MenuItems({ name, callback, index }: MenuItemProps) {
    return (<Menu.Item>
        {({ active }: { active: boolean }) => (
            < div
                className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                    'overflow-hidden',
                    'whitespace-nowrap',
                    'overflow-ellipsis',
                )}
                onClick={() => callback(index)}
            >
                {name}
            </div>
        )
        }
    </Menu.Item >);
}