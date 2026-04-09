import PlanCard from '@/components/custom/plan-card'
import React from 'react'

const MembershipPage = () => {
    return (
        <div className=''>
            <h1 className="text-xl font-bold mt-10 text-center">
                Upgrade with monthly membership
            </h1>
            <div className="flex flex-wrap justify-center">
                <PlanCard name="Monthly" image="/monthly.png" />
                <PlanCard name="Free" image="/free.png" />
            </div>
        </div>
    )
}

export default MembershipPage