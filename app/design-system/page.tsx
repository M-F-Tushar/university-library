import { Button } from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Skeleton } from "@/components/ui/Skeleton"

export default function DesignSystemPage() {
    return (
        <div className="container mx-auto py-10 space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold font-display">Design System</h1>
                <p className="text-lg text-gray-600">
                    Verification page for typography, colors, and components.
                </p>
            </div>

            {/* Typography Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Typography</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold font-display">Display Heading 1 (Lexend)</h1>
                        <h2 className="text-3xl font-bold font-display">Display Heading 2 (Lexend)</h2>
                        <h3 className="text-2xl font-semibold font-display">Display Heading 3 (Lexend)</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-base font-sans">
                            Body text using Inter. The quick brown fox jumps over the lazy dog.
                        </p>
                        <p className="text-sm font-sans text-gray-500">
                            Small text using Inter. The quick brown fox jumps over the lazy dog.
                        </p>
                        <p className="font-mono text-sm bg-gray-100 p-2 rounded inline-block">
                            Monospace text using JetBrains Mono
                        </p>
                    </div>
                </div>
            </section>

            {/* Colors Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-primary-50"></div>
                        <p className="text-sm font-mono">primary-50</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-primary-500"></div>
                        <p className="text-sm font-mono">primary-500</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-primary-600"></div>
                        <p className="text-sm font-mono">primary-600</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-primary-700"></div>
                        <p className="text-sm font-mono">primary-700</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-success"></div>
                        <p className="text-sm font-mono">success</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-warning"></div>
                        <p className="text-sm font-mono">warning</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-error"></div>
                        <p className="text-sm font-mono">error</p>
                    </div>
                </div>
            </section>

            {/* Components Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Components</h2>

                <div className="space-y-8">
                    {/* Buttons */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Buttons</h3>
                        <div className="flex flex-wrap gap-4">
                            <Button>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4 max-w-md">
                        <h3 className="text-lg font-medium">Inputs</h3>
                        <div className="space-y-4">
                            <Input placeholder="Default input" />
                            <Input placeholder="Error state" error />
                            <Input placeholder="Disabled" disabled />
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Cards</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card description goes here.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card content area. This is where the main content lives.</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Action</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Interactive Card</CardTitle>
                                    <CardDescription>Hover to see the effect.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
