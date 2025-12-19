import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// POST: Approve a resource
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // @ts-ignore - role exists on our user
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const resource = await prisma.resource.update({
            where: { id },
            data: {
                isApproved: true,
                approvedById: session.user.id,
            },
        });

        return NextResponse.json({ success: true, resource });
    } catch (error) {
        console.error('Error approving resource:', error);
        return NextResponse.json({ error: 'Failed to approve resource' }, { status: 500 });
    }
}

// DELETE: Reject and remove a resource
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // @ts-ignore - role exists on our user
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Delete the resource
        await prisma.resource.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error rejecting resource:', error);
        return NextResponse.json({ error: 'Failed to reject resource' }, { status: 500 });
    }
}
