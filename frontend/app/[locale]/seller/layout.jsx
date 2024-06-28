import SellerSidebar from "@/components/SellerComps/SellerSidebar/SellerSidebar";
import "./styles.css";
import { RestrictionSellerLayout } from "./restrictionHook";
import SellerMobileBottom from "@/components/SellerComps/MobileBottom/SellerMobileBottom";

export default function SellerLayout({ children }) {
    return (
        <RestrictionSellerLayout>
            <div className="container-xxl">
                <div className="row  vh-100">
                    <div className="d-none d-lg-block col-lg-2 bg-white shadow-sm  fs-15 px-0 ">
                        <div className="position-sticky top-0">
                            <SellerSidebar />
                        </div>
                    </div>
                    <div className="col-lg-10 p-0">{children}</div>
                </div>
            </div>
            <div className="d-sm-none mt-5 pt-5">
                <SellerMobileBottom />
            </div>
        </RestrictionSellerLayout>
    );
}
